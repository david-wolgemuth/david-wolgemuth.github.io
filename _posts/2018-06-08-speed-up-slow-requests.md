---
layout: post
title:  Speed Up Slow Requests
date:   2018-06-08
categories: rails performance
comments: true
---

What to do when your server responses are slowing down?

### Step 1: Find the bottleneck.

Whenever we are discussing performance issues, it's important to find the bottleneck.  The worst thing you can do is spend an hour bringing a process from 10 millisecond down to 9 milliseconds when another process is unnecessarily taking 900 milliseconds.

You may have heard the phrase "premature optimization is the root of all evil."  While this is an obvious overstatement, trying to speed up your server will 99% of the time make things more complicated.  Keep performance in mind while coding, but don't take any drastic measures to improve performance unless it is becoming a problem.

The 2 most common culprits for slowed responses:

1. Requests to external services (Mailers, Stripe, PayPal, Google Search, Google Maps, Facebook, OAuth...)
1. Requests to Databases
1. Rendering Excessive HTML

### Speed Up External Service Requests

#### Do you need to make the request now?

In the case of sending mailers, for example, it doesn't matter if you sent it now or 5 minutes from now (as long as it's sent in a reasonable amount of time).  Create a task for sending the email and add it to a queue - ActiveJob and Sidekiq are two common queuing frameworks.

Active Job and Active Mailer make this stupidly easy:

```ruby
UserMailer.welcome(@user).deliver_later
```

#### Could you have made the request ten minutes ago?

Imagine your customers often needed to view past Stripe payment information.  During a background task you could request commonly needed information stored on Stripe and save the records to your DB.  You have in effect "eagerly requested" the necessary information.

### Speed Up Database Requests

#### Avoiding N+1 Queries

In Rails' Active Record it is very easy to make DB requests.  Sometimes too easy.  The most common mistake for those starting with Active Record is the "N+1" problem.

Scenario:  you have 2 tables, `blogs` and `blog_posts`, where a blog has many blog_posts and an blog_post belongs to a blog.  On your main page you want to list all blogs and the titles of their blog posts.

Controller Method:

```ruby
def all_blogs
  @blogs = Blog.all
end
```

top_blogs.html.erb

```html
<ul>
  <% @blogs.each do |blog| %>
    <li>
      <h3><%= blog.name %><h3>
      <% blog.blog_posts.each do |blog_post| %>
        <%= link_to blog_post.title blog_post_path(blog_post) %>
      <% end %>
    </li>
  <% end %>
</ul>
```

Pull the queries out so we can see what's happening:

```ruby
Blog.all.each do |blog| # Query: `SELECT * FROM blogs;`
  blog.blog_posts.each do |blog_post| # Query: `SELECT * FROM blog_posts WHERE blog_posts.blog_id=?`
    blog_post.title
  end
end
```

The inner query will run for _each blog_.  This means that if you have 50 blogs, you will have run 51 queries (1 for the initial list of blogs, and 1 for each of the 50 blogs).  If you haven't made the connection, this is why we it the "N+1" problem.  This is a problem because each request has a log of overhead - ideally we would get all the information we want with only 1 query (not always possible).

The main tool in Active Record for solving this problem is `includes` which will eager load.

```ruby
Blog.all.includes(:blog_posts)
```

This will run 2 queries:
```sql
SELECT * FROM blogs;
SELECT * FROM blog_posts WHERE id IN ( 1,2,3,4,5... )
```

(the id list is taken from the first query)

This is a very basic example. In addition to the docs, there are endless blog posts on how to effectively use "includes" in real situations (ex: [Tips to Avoid N+1 Queries](https://medium.com/@codenode/10-tips-for-eager-loading-to-avoid-n-1-queries-in-rails-2bad54456a3f)).

#### Only Select What You Need

By default, Active Record will `SELECT *` from a table.  Often, all you need is a list of ids, emails, urls, etc.

Also, running logic in a SQL query will usually be faster than grabbing a bunch of records and doing logic in ruby.

With the intended output:

```html
<ul>
  <% users_with_blogs.each do |user| %>
    <li><%= user.email %></li>
  <% end %>
</ul>
```

You could get this information like so:

```ruby
users_with_blogs = User.includes(:blogs).reject { |user| user.blogs.length.zero? }
```

The issue is that we are querying for ALL of the blogs and ALL columns on users and blogs.  We never even use the blog other than to verify they exist.

```ruby
users_with_blogs = User.joins(:blogs).select(:email).group(:email)
```

(`joins` will by default do an `INNER LEFT JOIN`, so it will exclude users without blogs)

Because we use `joins`, the blogs are never brought into ruby memory.  We can then choose to only select `:email` because that is all that is being used for the html, and group by email to remove duplicates (because we are joining, a new row will be returned for every blog the user has).

#### Cache Common Queries

At my previous company, there was a process that was commonly run for customer that required multiple requests joining 10+ tables.  It often took a few seconds to get all of the information, but most of the data was the same regardless of the customer variable.

My solution was to organize the static data in a tree structure with easy access to necessary info, and save the tree into a Redis cache.  Every 30 minutes, a background task ran to ensure the tree was up to date by checking the `updated_at` datetime fields.  Now, running the calculation only required joining 2 tables and pulling a tree into memory.

### Rending HTML Intelligently

The answer is to use JavaScript in some sort of fashion.  This will put HTML rendering responsibility on the client rather than the server.  The server will only be responsible for sending initial pages then updates via JSON or HTML partials.

#### Use a JavaScript Framework

React, Angular, Vue...

I will not dive into any particulars here, but the main benefit of a JavaScript framework is the ability to easily make a Single Page Application.

Pros:

- The responsibility of rendering HTML is completely removed from the Server and given to the Client
- Highly interactive user experiences
- Smooth transitions
- Complete separation of concerns between front end and back end
- Well defined patterns for coding views, managing state

Cons:

- Extra complexity / hurdles to jump through
- Requires separate testing framework / bug tracking services / data organization
- Second language and framework (senior React developers are hard to come by these days)

#### AJAX and Partials

If not using a full-blown framework, JavaScript can still be sprinkled through the app to replace aspects of a page without the server needing to re-render a full page.  This can be used after submitting a form, clicking through result pagination, or tabbing through sections.

Pros:

- JavaScript is not _required_ - use it when you wish to
- Easily test partial views / routes as you would with regular views / routes
- Very low learning curve

Cons:

- Can lead to ["Spaghetti Code"](https://www.urbandictionary.com/define.php?term=spaghetti%20code) if you aren't careful
- Interactions and client-side state are more difficult to maintain
- Can be difficult to test and debug

Now go into the world and speed up those slow webapps!
