---
layout: post
title: "Choir Parts"
date: 2025-02-17
tags: audio static-site
---

To help me easily find parts as recorded,

Only Bass for now,

```html
<!-- Example audio embedding -->
<audio controls>
<source src="path/to/audio.mp3" type="audio/mpeg">
Your browser does not support the audio element.
</audio>
```

To find all audio files in a directory,

```sh
find ./assets/audio -mindepth 1

# $ find ./assets/audio -mindepth 1
# ./assets/audio/Life Calls Us On - Bass.wav
# ./assets/audio/CR#27 The Wisdom of the Ancients - Bass.wav
# ./assets/audio/Woyaya - Pt.1 Bass & Alto.wav
```

shell / python script (bash python -c "...") to generate the html,
from the output of the find command,

```sh
find ./assets/audio -mindepth 1 | python3 -c "
import sys
files = [line.strip() for line in sys.stdin]
for file in files:
    # Remove the leading . from the path
    _period, file = file.split('.', maxsplit=1)

    song_name = file.split('/')[-1]

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
```

Example output,

```html

        <p>
            Life Calls Us On - Bass.wav
        </p>
        <audio controls>
            <source src="/assets/audio/Life Calls Us On - Bass.wav" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
        <br>


        <p>
            CR#27 The Wisdom of the Ancients - Bass.wav
        </p>
        <audio controls>
            <source src="/assets/audio/CR_27 The Wisdom of the Ancients - Bass.wav" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
        <br>


        <p>
            Woyaya - Pt.1 Bass & Alto.wav
        </p>
        <audio controls>
            <source src="/assets/audio/Woyaya - Pt.1 Bass & Alto.wav" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
        <br>
```

The result:

## Songlist

<p>
    Life Calls Us On - Bass.wav
</p>
<audio controls>
    <source src="/assets/audio/Life Calls Us On - Bass.wav" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>
<br>


<p>
    CR_27 The Wisdom of the Ancients - Bass.wav
</p>
<audio controls>
    <source src="/assets/audio/CR_27 The Wisdom of the Ancients - Bass.wav" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>
<br>


<p>
    Woyaya - Pt.1 Bass & Alto.wav
</p>
<audio controls>
    <source src="/assets/audio/Woyaya - Pt.1 Bass & Alto.wav" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>
<br>

## Next Steps

- Add more music
- Add the other parts
- Compress MP3s for faster loading / better storage
- Add a search bar
