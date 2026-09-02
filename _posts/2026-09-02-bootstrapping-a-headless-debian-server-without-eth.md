---
layout: post
title: "Timeline: Bringing Up a Headless Debian Server Without Ethernet"
date: 2026-09-02
tags: [linux, operations, timeline]
excerpt: "A chronological command record for bootstrapping a minimal Debian server with no usable Ethernet path."
---

<blockquote class="ai-gen" markdown="1">

**The following is AI Generated:** This technical timeline has been generalized from a private setup session. It omits credentials, network names, addresses, account names, device identifiers, and other configuration-specific details. Placeholders such as `<wifi-interface>` and `<server-address>` replace values used during the actual session.

## Scope

Target state: a minimal Debian server that boots unattended, reconnects over Wi-Fi, receives DHCP and DNS automatically, and accepts SSH public keys only.

The record keeps the commands that mattered, their expected signals, and the observed results. It excludes exploratory commands that did not change the diagnosis, plus any command that would reveal a credential.

## Pre-install: decide whether to keep Windows

The desktop arrived with Windows installed. The original question was whether a full-disk Debian installation would destroy the license.

```powershell
powershell (Get-CimInstance -Query 'select * from SoftwareLicensingService').OA3xOriginalProductKey
```

**Expected:** an OEM key indicates that Windows activation is tied to the hardware firmware rather than the existing Windows partition.

**Actual:** the command returned an OEM product key.

**Decision:** use the whole disk for Debian instead of preserving a Windows dual-boot partition. A future Windows reinstall remains possible on the same hardware.

## Create installation media and boot it

1. Download the Debian AMD64 netinst ISO on a separate Windows machine.
2. Write it to an 8 GB USB drive with Rufus in DD mode.
3. Select the UEFI USB entry in the desktop firmware boot menu.

**Expected:** the hybrid installer image may appear as more than one bootable USB entry.

**Actual:** the firmware showed two UEFI-looking entries for the same USB device. Selecting the EFI-partition entry reached the Debian installer.

## Installer choices

No shell commands were run during this phase. The installer choices were:

- Leave the root password blank to grant the first user `sudo` access.
- Use the full disk for Debian.
- Use plain partitioning rather than LVM.
- Skip disk encryption so a reboot will not stop at a local unlock prompt.
- Continue without a package mirror because no network path was available.

**Expected:** a minimal but bootable Debian system with an EFI System Partition, root filesystem, and swap.

**Actual:** the machine booted into a minimal Debian installation. Its APT source list had no active repositories, and it had no desktop network manager.

## Identify the Wi-Fi hardware

The initial task was to determine whether the wireless adapter existed and whether the kernel had initialized it.

```sh
lspci | grep -i network
lspci -nn | grep -i wireless
sudo dmesg | grep -i iwlwifi
```

**Expected:** PCI output should identify the adapter; kernel output should reveal whether the driver and firmware initialized.

**Actual:** the PCI device was an Intel AX200 Wi-Fi adapter. The driver initially reported a probe timeout (`-110`), so no usable wireless interface appeared at first.

The driver was reloaded during diagnosis:

```sh
sudo modprobe -r iwlwifi
sudo modprobe iwlwifi
```

**Expected:** a transient initialization failure may clear after a module reload.

**Actual:** the problem persisted initially.

## Adjust PCIe power management and recheck the adapter

The kernel command line was adjusted through GRUB. The exact edit was made in `/etc/default/grub`:

```text
GRUB_CMDLINE_LINUX_DEFAULT="quiet pcie_aspm=off"
```

Then:

```sh
sudo update-grub
sudo reboot
cat /proc/cmdline
ip link
```

**Expected:** `/proc/cmdline` should include `pcie_aspm=off`; `ip link` should eventually show a wireless interface if the adapter initializes.

**Actual:** the kernel command line contained the new parameter. After a subsequent reboot, `ip link` showed `<wifi-interface>`.

This did not prove that PCIe ASPM was the only cause of the original timeout. It established that the adapter eventually initialized and that the next problem was user-space networking.

## Discover the missing minimal-install components

The first attempt to scan and authenticate showed that several expected utilities were absent:

```sh
iw dev
wpa_passphrase "<ssid>" "<password>"
sudo dhclient <wifi-interface>
```

**Expected:** `iw` scans or lists Wi-Fi devices; `wpa_passphrase` creates a WPA configuration; `dhclient` requests an address.

**Actual:** each relevant utility was missing from the minimal installation. This established that the machine needed firmware, WPA authentication software, Wi-Fi diagnostics, and a DHCP/network-management path before it could join a protected network.

## Attempt a temporary Ethernet bootstrap

The available Ethernet cable normally connected the home router to the modem. It was temporarily moved to the server.

First identify and enable the wired interface:

```sh
ip link
sudo ip link set <wired-interface> up
ip link show <wired-interface>
```

**Expected:** a carrier flag indicates that the cable and port have a physical link.

**Actual:** the interface first showed `NO-CARRIER`. After re-seating the cable, it reported carrier and an UP state.

Then attempt DHCP using the client available in the base system:

```sh
which dhcpcd
sudo dhcpcd <wired-interface>
ip addr show <wired-interface>
ping -c 3 8.8.8.8
```

**Expected:** a DHCP lease should produce a normal LAN or ISP address; numeric ping should establish Internet reachability independently of DNS.

**Actual:** the machine received a usable lease once, but subsequent attempts fell back to a `169.254.x.x` address and numeric ping failed. The direct modem connection did not provide a reliable DHCP path for the server.

**Conclusion:** Ethernet proved the local hardware link, but the modem was not a substitute for connecting to the home router. The router connection was restored.

## Reuse the USB drive as an offline package channel

The DD-written installer USB was not usable as a normal writable Windows drive. It was reformatted as a standard removable drive, then used to transfer Debian packages.

On the server, mount the USB and inspect its contents:

```sh
lsblk
sudo mkdir -p /mnt/usb
sudo mount <usb-partition> /mnt/usb
ls /mnt/usb
```

Install the first locally transferred package set:

```sh
sudo dpkg -i /mnt/usb/*.deb
```

**Expected:** `dpkg` installs local packages and reports any missing dependencies by name.

**Actual:** Wi-Fi firmware installed. The WPA supplicant and Wi-Fi utility were unpacked but could not configure until missing `libnl` libraries and a smart-card library were provided.

After downloading and transferring those exact dependency packages, rerun:

```sh
sudo umount /mnt/usb
sudo mount <usb-partition> /mnt/usb
sudo dpkg -i /mnt/usb/*.deb
```

**Expected:** dependency installation completes package configuration.

**Actual:** the firmware, WPA supplicant, Wi-Fi utility, and dependencies installed successfully.

## Establish a temporary Wi-Fi connection

Confirm that the adapter exists, then enable it:

```sh
sudo /usr/sbin/iw dev
sudo ip link set <wifi-interface> up
```

**Expected:** the adapter appears and can be put administratively UP.

**Actual:** the interface existed. An active scan did not return promptly, so it was interrupted. Scanning was unnecessary because the intended network name was already known.

Create the temporary WPA configuration without publishing credentials:

```sh
wpa_passphrase "<ssid>" "<password>" | \
  sudo tee /etc/wpa_supplicant/wpa_supplicant-<wifi-interface>.conf >/dev/null

sudo /usr/sbin/wpa_supplicant -B \
  -i <wifi-interface> \
  -c /etc/wpa_supplicant/wpa_supplicant-<wifi-interface>.conf
```

**Expected:** WPA authentication associates the radio with the access point. This alone does not create an IP address.

**Actual:** the radio associated successfully.

The missing `dhclient` utility was replaced temporarily with a small `systemd-networkd` configuration:

```ini
# /etc/systemd/network/25-wifi.network
[Match]
Name=<wifi-interface>

[Network]
DHCP=yes
```

```sh
sudo systemctl enable --now systemd-networkd
sudo systemctl restart systemd-networkd
ip addr show <wifi-interface>
```

**Expected:** DHCP assigns an IPv4 address to the wireless interface.

**Actual:** an address was assigned, proving that the Wi-Fi association and router DHCP both worked.

## Separate routing from DNS

Test the path by address before testing a hostname:

```sh
ping -c 3 1.1.1.1
ping -c 3 deb.debian.org
```

**Expected:** if the first succeeds and the second fails, the route works and only name resolution is missing.

**Actual:** numeric ping worked first. The hostname test failed with a name-resolution error.

Inspect and update the resolver configuration:

```sh
cat /etc/resolv.conf
sudo vi /etc/resolv.conf
```

Add public resolvers or the appropriate local resolvers:

```text
nameserver <resolver-one>
nameserver <resolver-two>
```

Then retest:

```sh
ping -c 3 deb.debian.org
```

**Actual:** hostname resolution succeeded after resolver configuration was present.

## Restore APT repositories and normal package access

Inspect the source list:

```sh
cat /etc/apt/sources.list
```

**Expected:** a system installed without a mirror may have only comments and no active sources.

**Actual:** no active repositories were configured.

Add the Debian stable, updates, and security sources:

```text
deb http://deb.debian.org/debian trixie main contrib non-free non-free-firmware
deb http://deb.debian.org/debian trixie-updates main contrib non-free non-free-firmware
deb http://deb.debian.org/debian-security trixie-security main contrib non-free non-free-firmware
```

Then refresh package metadata and install the network manager:

```sh
sudo apt update
sudo apt install network-manager
```

**Expected:** `apt update` downloads package indexes; the install command adds NetworkManager and dependencies.

**Actual:** normal APT access returned. A later `sudo apt upgrade` updated the base system.

## Hand the wireless interface to NetworkManager

Inspect NetworkManager's view of the interface:

```sh
nmcli device status
```

**Expected:** it may show the wireless interface as disconnected because the existing connection was created by a separate WPA process and `systemd-networkd`.

**Actual:** the interface showed as disconnected even though the radio was associated through the temporary stack.

Stop the temporary WPA process and create a persistent NetworkManager profile:

```sh
sudo systemctl disable --now wpa_supplicant@<wifi-interface>
sudo pkill wpa_supplicant
sudo nmcli --ask device wifi connect "<ssid>" ifname <wifi-interface>
```

**Expected:** `nmcli --ask` prompts for the secret without leaving it in command history, saves a connection profile, and activates it.

**Actual:** NetworkManager created a saved Wi-Fi connection. `nmcli device status` reported the wireless interface connected.

Disable the temporary DHCP manager after NetworkManager has an active profile:

```sh
sudo systemctl disable --now systemd-networkd
sudo systemctl restart NetworkManager
ip addr show <wifi-interface>
ip route
ping -c 3 1.1.1.1
ping -c 3 deb.debian.org
```

**Expected:** NetworkManager should own the address, default route, and DNS after the restart.

**Actual:** stopping `systemd-networkd` briefly removed the working path because it had supplied the existing lease. Restarting NetworkManager caused it to acquire and own the lease. Numeric and hostname pings then succeeded.

## Install and harden SSH

Install and enable the OpenSSH server:

```sh
sudo apt install openssh-server
sudo systemctl enable --now ssh
hostname -I
```

**Expected:** the service listens after installation; `hostname -I` displays the current DHCP address.

**Actual:** the server started successfully and was reachable from the intended local client.

Add the intended public key from a public key source over HTTPS:

```sh
mkdir -p ~/.ssh
chmod 700 ~/.ssh
curl -fsSL https://github.com/<public-account>.keys >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Test public-key authentication from a second machine before changing server policy:

```sh
ssh -o PreferredAuthentications=publickey \
  -o PasswordAuthentication=no \
  <user>@<server-address>
```

**Expected:** the command should open a session without asking for the server account password.

**Actual:** public-key login succeeded after using the canonical `publickey` authentication method name.

Create a local SSH policy drop-in:

```text
# /etc/ssh/sshd_config.d/99-key-only.conf
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
```

Validate, inspect, and reload:

```sh
sudo sshd -t
sudo sshd -T | grep -E 'passwordauthentication|kbdinteractiveauthentication|permitrootlogin|pubkeyauthentication'
sudo systemctl reload ssh
```

**Expected:** `sshd -t` exits cleanly; `sshd -T` reports password and keyboard-interactive authentication disabled, root login disabled, and public-key authentication enabled.

**Actual:** the effective configuration matched the intended policy. A second SSH connection still worked with a public key only.

## Reboot test

Run:

```sh
sudo reboot
```

Then, from the intended client:

```sh
ssh <user>@<server-address>
```

**Expected:** the server returns without local input, reconnects to Wi-Fi, obtains a lease, resolves names, starts SSH, and accepts the configured key.

**Actual:** the SSH connection succeeded after reboot.

## Current state and deferred work

Verified state:

- Debian boots unattended.
- NetworkManager owns the wireless interface.
- DHCP, routing, and DNS work after reboot.
- OpenSSH starts automatically and accepts public keys only.

Deferred work:

- Create a DHCP reservation before relying on a fixed local address.
- Add Tailscale for remote access outside the home network.
- Resolve a separate connection issue affecting a work-managed Mac.
- Remove old bootstrap files and scrub any shell history entries that contained Wi-Fi credentials.

</blockquote>
