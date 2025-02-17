---
layout: post
title: "Cowork Frederick Bulletin Board Proof of Concept"
date: 2025-02-17
tags: raspberry-pi cowork-frederick javascript
---

This is a proof of concept for a "bulletin board" that cycles through different tabs on the Cowork Frederick website.

The bulletin board:

<code id="current-url"></code>
<iframe
    id="bulletin-board"
    src=""
    width="100%"
    height="800px"
    frameborder="1"
    style="border: 1px solid #ccc; background-color: pink;"
></iframe>

<script>
    const TABS_TO_CYCLE = [
        {
            name: "Upcoming Events",
            url: "https://coworkfrederick.com/upcoming-events/"
        },
        {
            name: "All Members",
            url: "https://coworkfrederick.com/meet-the-members-of-cowork-frederick/",
        },
    ];


    // scrape list of members from the members page
    // $.get(
    // NOTE - due to CORS, would need to do this "server-side"
    // (could use a github action, or a function on the raspberry pi)

    const iframe = document.getElementById('bulletin-board');
    const currentUrl = document.getElementById('current-url');

    const MS_PER_TAB = 3 * 1000;
    let currentTab = 0;

    setInterval(() => {
        currentTab = (currentTab + 1) % TABS_TO_CYCLE.length
        iframe.src = TABS_TO_CYCLE[currentTab].url;
        currentUrl.innerText = TABS_TO_CYCLE[currentTab].url;
    }, MS_PER_TAB);
</script>

## How the site works

It uses an iframe to display the content, and JavaScript to cycle through the tabs.

```html
<iframe
    id="bulletin-board"
    src=""
    width="100%"
    height="800px"
    frameborder="1"
    style="border: 1px solid #ccc; background-color: pink;"
></iframe>

<script>
    const TABS_TO_CYCLE = [
        {
            name: "Upcoming Events",
            url: "https://coworkfrederick.com/upcoming-events/"
        },
        {
            name: "All Members",
            url: "https://coworkfrederick.com/meet-the-members-of-cowork-frederick/",
        },
    ];


    // scrape list of members from the members page
    // $.get(
    // NOTE - due to CORS, would need to do this "server-side"
    // (could use a github action, or a function on the raspberry pi)

    const iframe = document.getElementById('bulletin-board');
    const currentUrl = document.getElementById('current-url');

    const MS_PER_TAB = 3 * 1000;
    let currentTab = 0;

    setInterval(() => {
        currentTab = (currentTab + 1) % TABS_TO_CYCLE.length
        iframe.src = TABS_TO_CYCLE[currentTab].url;
        currentUrl.innerText = TABS_TO_CYCLE[currentTab].url;
    }, MS_PER_TAB);
</script>
```

## How the bulletin board will run

The bulletin board will run on a Raspberry Pi, which will be connected to a monitor in the Cowork Frederick space.

The Raspberry Pi will be set up to run the bulletin board on boot, and will cycle through the tabs every few seconds.

<details>

<blockquote>
    <p>Triggering Website on Linux Boot</p>
    <p> To trigger loading a specific website on Linux boot, you can use systemd to start a web browser with a specific URL. Create a systemd user service file in ~/.config/systemd/user and add the following content:</p>
    <pre><code>
[Unit]
Description=Start Firefox
PartOf=graphical-session.target

[Service]
ExecStart=/usr/bin/firefox https://example.com
Type=simple
Restart=on-failure

[Install]
WantedBy=xsession.target
</code></pre>
    <p>Replace https://example.com with the URL you want to open. Enable and start the service with the following commands:</p>
    <pre><code>
systemctl --user enable firefox
systemctl --user start firefox
</code></pre>

https://unix.stackexchange.com/questions/575527/opening-web-browser-on-boot
</blockquote>

</details>

Can trigger a refresh (JS) daily to ensure the bulletin board is up to date. (if adding new members, etc.)

## Next Steps

Get the list of members from the members page, and display individual members.

Get the list of upcoming events from the events page, and display individual events.

This must be done "server-side" (e.g. using a GitHub Action or a function on the Raspberry Pi) **to avoid CORS issues**.



