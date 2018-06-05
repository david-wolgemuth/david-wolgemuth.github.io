---
layout: post
title:  Artists You May Like
date:   2018-06-05
categories: sql data_structures algorithms
---

How does a company like Spotify provide artists similar to those you like? (Because you like "Hans Zimmer", you may also like "Harry Gregson-Williams")

Here is a simplified database setup along with queries to determine this information.

```
users
-id
-username

likes
-id
-user_id
-song_id

artists
-id
-name

songs
-id
-artist_id
-name
```

Find all artists USER likes:

<script src="https://gist.github.com/david-wolgemuth/0f234877981fe49a82133f744d963983.js"></script>

Find all users who like the artists USER likes:

<script src="https://gist.github.com/david-wolgemuth/c0b332ddeab6e0018ce56fe45a1e3fa2.js"></script>

Find all artists the found users like but USER does not like (yet):

<script src="https://gist.github.com/david-wolgemuth/7794158162f9cd322a98b2926bc28f4b.js"></script>

This is fairly limited in what it can tell us but could be extended to provide more information. For example:

- count the likes for the artists
- give higher weight to users whose tastes are most similar to USER
- assign genres to songs
- track how many times the users have listened to each song
