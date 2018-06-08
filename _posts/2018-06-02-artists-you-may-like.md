---
layout: post
title:  Artists You May Like
date:   2018-06-02
tags: sql data_structures algorithms rails
---

Because you like "Hans Zimmer", you may also like "Harry Gregson-Williams."  How did you know that Spotify??

Below I have outlined the first approach that comes to mind:

1. Find all artists you like
2. Find all users who like the same artists as you
3. Find all artists those users like, but you haven't liked yet

Here is a simplified database setup along with queries to determine this information.

```
users
-id

likes
-id
-user_id
-song_id

artists
-id

songs
-id
-artist_id
```

Find all artists USER likes:

<div class="gist-picker">
  <div class="gist-wrapper" data-title="SQL">
    <script src="https://gist.github.com/david-wolgemuth/0f234877981fe49a82133f744d963983.js"></script>
  </div>
  <div class="gist-wrapper" data-title="Rails">
    <script src="https://gist.github.com/david-wolgemuth/b06bcb200bd205dabbf5ec64b7665949.js"></script>
  </div>
</div>

Find all users who like the artists USER likes:

<div class="gist-picker">
  <div class="gist-wrapper" data-title="SQL">
    <script src="https://gist.github.com/david-wolgemuth/c0b332ddeab6e0018ce56fe45a1e3fa2.js"></script>
  </div>
  <div class="gist-wrapper" data-title="Rails">
    <script src="https://gist.github.com/david-wolgemuth/01cea50ad2be3626bb16f5b03445bdf5.js"></script>
  </div>
</div>

Find all artists the found users like but USER does not like (yet):

<div class="gist-picker">
  <div class="gist-wrapper" data-title="SQL">
    <script src="https://gist.github.com/david-wolgemuth/7794158162f9cd322a98b2926bc28f4b.js"></script>
  </div>
  <div class="gist-wrapper" data-title="Rails">
    <script src="https://gist.github.com/david-wolgemuth/ac761dd7bf001fa1e5efef6a688c9c59.js"></script>
  </div>
</div>

This is fairly limited in what it can tell us but could be extended to provide more information. For example:

- count the likes for the artists
- give higher weight to users whose tastes are most similar to USER
- assign genres to songs
- track how many times the users have listened to each song
