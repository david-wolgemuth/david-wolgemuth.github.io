---
layout: post
title:  My Favorite Algorithm
date:   2018-05-29
tags: ruby javascript algorithms
---
Merge Sort.  It has a few fun challenges that make for a wonderful and elegant sorting algorithm. And O(nlogn) time!  Goosebumps.

Below this implementation I have described the strategy.
<div class="gist-picker">
  <div class="gist-wrapper" data-title="Ruby">
    <script src="https://gist.github.com/david-wolgemuth/fad15dd80030e8e75bf39207f6bccf88.js"></script>
  </div>
  <div class="gist-wrapper" data-title="JavaScript">
    <script src="https://gist.github.com/david-wolgemuth/2ebaa71dfda6173f29be44f5ce8e4a95.js"></script>
  </div>
</div>

Lets start at a high level with the `merge_sort` function.

`merge_sort pseudo-code`

```
if the array is empty or only 1 element
  it is already sorted

otherwise
  sort the left half
  sort the right half
  combine the left and right, maintaining sort
```

Recusion can be difficult to visualize, but I will try.

- recurse sort on the left half of the array
  - recurse sort on the left half of the left half of the array
    - recurse sort on the left half of the left half of the left half of the array
      - ...
        - the piece we are working with is 1 element long, we're done splitting
      - recurse sort on the _right_ half of the left haft of the left haft of the array
        - the piece we are working with is 1 element long, we're done splitting
      - Finally. The actual work.

We now have 2 sorted arrays (it feels like cheating, but an array with 1 element is sorted).

We take our 2 arrays and combine them together **maintaining sort**.  This takes us out of the `merge_sort` function and into the `merge_sorted` function.

`merge_sorted pseudo-code`

```
Hold onto 2 cursors (one for each array)
While we still have unchecked elements
  compare the current element of the first array with the current element of the second array
  whichever element is less
    add it to the output array and move the appropriate cursor to the right
```

The 2 single element arrays are now sorted into 1 sorted array.  As the function continues to run, the single element arrays will combine into larger and larger arrays until the initial halves have been recombined into a sorted array.

For further resources, Google it!  There are many visualization tools online, but I am fond of [hackerearth's merge-sort](https://www.hackerearth.com/practice/algorithms/sorting/merge-sort/visualize/).  Try to re-write merge-sort in your language of choice!  It's a rewarding experience.
