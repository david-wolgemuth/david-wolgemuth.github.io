#! /usr/bin/env python3

import re

EXAMPLE_USAGE = """
find ./assets/audio -mindepth 1 | python3 -c "
import sys
files = [line.strip() for line in sys.stdin]
for file in files:
    # Remove the leading . from the path
    _period, file = file.split('.', maxsplit=1)

    song_name = file.split('/')[-1]

    if song_name in ['.DS_Store']:
        continue

    # Folder name, not a song
    if '.mp3' not in song_name:
        print(f'<h3>{song_name}</h3>')
        continue

    print(f'''
        <p>
            {song_name}
        </p>
        <audio controls>
            <source src=\"{file}\" type=\"audio/mpeg\">
            Your browser does not support the audio element.
        </audio>
        <br>
    ''')
"
# # Copy the output to the clipboard
# | pbcopy
"""


def generate_song_list_html(files: list) -> str:
    """
    Generates an HTML representation of the song list, including:
    - A Table of Contents (ToC) linking to each song.
    - A structured list of folders and their songs.

    :param files: List of file paths.
    :return: HTML string.
    """
    html_elements = []
    toc_elements = []
    folders = {}

    for file in files:
        file = file.lstrip(".")  # Remove leading '.' if present
        file_parts = file.split("/")

        if file.endswith(".mp3"):
            folder_name = "/".join(file_parts[:-1])  # Extract folder path
            song_name = file_parts[-1]  # Extract song name

            if folder_name not in folders:
                folders[folder_name] = []

            folders[folder_name].append(song_name)

        elif file.endswith(".DS_Store"):
            continue  # Ignore system files

        else:
            # Folder name, not an actual song file
            if file not in folders:
                folders[file] = []

    # Generate Table of Contents (ToC)
    toc_elements.append("<h2>Table of Contents</h2>\n<ul>")
    for folder, songs in folders.items():
        folder_id = re.sub(r"\W+", "-", folder).strip(
            "-"
        )  # Generate a folder-friendly ID
        toc_elements.append(f'<li><a href="#{folder_id}">{folder}</a>\n<ul>')
        for song in songs:
            song_id = re.sub(r"\W+", "-", song).strip(
                "-"
            )  # Generate a song-friendly ID
            toc_elements.append(f'<li><a href="#{song_id}">{song}</a></li>')
        toc_elements.append("</ul></li>")
    toc_elements.append("</ul>")

    # Generate HTML song list with IDs for links
    for folder, songs in folders.items():
        folder_id = re.sub(r"\W+", "-", folder).strip("-")  # Same ID logic as ToC
        html_elements.append(f'<h3 id="{folder_id}">{folder}</h3>')
        for song in songs:
            song_id = re.sub(r"\W+", "-", song).strip("-")  # Same ID logic as ToC
            html_elements.append(f'''
            <p id="{song_id}">{song}</p>
            <audio controls>
                <source src="{folder}/{song}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <br>
            ''')

    # Remove extra spaces from the output
    for i in range(len(html_elements)):
        html_elements[i] = re.sub(r"\s+", " ", html_elements[i]).strip()

    for i in range(len(toc_elements)):
        toc_elements[i] = re.sub(r"\s+", " ", toc_elements[i]).strip()

    return "\n".join(toc_elements) + "\n" + "\n".join(html_elements)


if __name__ == "__main__":
    import sys

    files = [line.strip() for line in sys.stdin if line.strip()]
    print(generate_song_list_html(files))
