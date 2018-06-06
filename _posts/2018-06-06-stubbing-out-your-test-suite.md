---
layout: post
title:  Stubbing out your test suite
date:   2018-06-06
categories: tdd rails oop
excerpt: Write tests with maximum coverage, feel confident when they pass, and not wait 10 minutes every time they run!  Woohoo!
---


### My Story With Testing Stripe

Stripe was integrated in my previous company's webapp.  We were using Stripe in arguably the most critical part of the app, the checkout process.  (If the customer can't checkout, we can't take their money.  We want money!!)

It would make sense that we wanted to heavily test this aspect of the app.  But there was a problem, making external calls to Stripe slowed down the tests considerably.  At up to 1 second per request, time added up quickly for a developer who would have loved to run the test suite after any changes.

The progression of our test suite:

- the time to run the suite piled up to a few minutes
- we stopped running the suite during development because it was too slow
- a few tests stopped passing, but a bug-fix needed to be deployed ASAP... so we skipped the suite 😏
- developers have written aliases to bypass the test suite during deployment because so many quick bug-fixes were required (not a good sign)
- we have lost confidence in the test suite's accuracy
- we wondered why we wrote tests in the first place... 😭

Sound familiar to anyone?

So how can we write tests, cover everything we want to cover, feel confident when they pass, _and_ not wait 10 minutes for them to complete?

Perhaps the biggest bang for your buck is to stub out external services with fakes.

### A Quick, Naive Approach to Integrating Stripe

Below is an example a Stripe checkout process.  We will be looking at how to test it _without_ slowing down our tests.

(The example is nearly identical to Stripe's [Getting Started](https://stripe.com/docs/checkout/rails) code.)

<script src="https://gist.github.com/david-wolgemuth/41b2700f2bae626f19ad27635a80a878.js"></script>

### Moving Our Logic to A Separate Class

Right away we'll probably want to refactor the code for a few reasons.

1. Once we add anything else to this method, our controller will feel bloated.  Ideally, the controller should only house basic logic.
1. The view will directly be calling Stripe's methods on the `@charge` object.  Views really should never talk directly with models or outside services -- violating separation of concerns.
1. We cannot test this without Controller tests, which will slow down our tests and include a bunch of other confusion.

Let's write a wrapper object for the payment processing functionality.

If we write a plain-old-ruby-object, we can unit test it and fully decouple it from the rest of the system.  We also don't want any Stripe methods/classes to be passed to or returned from the public methods.  Ideally, if we were to change services to PayPal, this would be the only class we'd have to touch.

<script src="https://gist.github.com/david-wolgemuth/aa85839032cc8f31ba1bc493e07c7b69.js"></script>

<script src="https://gist.github.com/david-wolgemuth/ed071a3e9a769c4eca2a61c265a303e2.js"></script>

### Writing Tests for our Service

Next we will write a few tests for the PaymentProcess class. You may notice they are relatively simple compared to your average model/controller/view specs, but still provide us with confidence that the system works.

(`tok_visa` and `tok_chargeDeclined` are test tokens provided by Stripe. <https://stripe.com/docs/testing#cards>)

<script src="https://gist.github.com/david-wolgemuth/76b426ca7141df147663ccc9aad27774.js"></script>

### Stubbing Our Service with a Fake

Now for the interesting part.  Let's test the system _without_ making calls to Stripe by writing a fake class with hard-coded data.  We only need to write enough code to pass the tests.  We do **not** need to re-implement the entirety of Stripe.

<script src="https://gist.github.com/david-wolgemuth/b0b2b5f434e84d6bdbc17b91d787b32d.js"></script>

With a few helper methods we can easily toggle our fake class on or off depending on how willing we are to wait a few extra minutes.

<script src="https://gist.github.com/david-wolgemuth/c145c55e11ae5048858b29c1e591dc55.js"></script>

### The Results

Running the test suite with `TEST_PROCESS_PAYMENT` set:

```
$ TEST_PROCESS_PAYMENT=true bundle exec spring rspec
Running via Spring preloader in process 88681
.........................................................

Finished in 8.47 seconds (files took 0.95742 seconds to load)
57 examples, 0 failures
```

Running the test suite _without_ `TEST_PROCESS_PAYMENT` set:

```
$ bundle exec spring rspec
Running via Spring preloader in process 88409
.........................................................

Finished in 1.75 seconds (files took 1.13 seconds to load)
57 examples, 0 failures
```

For this tiny app, we are already saving 7 seconds!  And the wonderful thing is that we only ever have to run the "real" tests if we change versions of Stripe or alter the `ProcessPayment` class.


### But it's so much extra work!

To address the main objection I assume is going through your head. Writing fake classes takes a lot of work and in this case we have more than doubled the lines of code.  I will leave it up to you whether or not your system is complex enough to benefit from this method.

If your team is not following TDD, it might not be that big of a deal if the tests take a long time to run.  You might not care if this part of your system has full test coverage or is simply "good enough" for now.  Perhaps your client has a "we'll fix it if it breaks - just get it out the door" mindset.

The good news is that we don't need to implement every part of the service we are faking, only those which are included in the test suite.  More good news is that you are not the only development team using the external services you use.  For popular services like Stripe, you can find [robust and inclusive fakes](https://github.com/rebelidealist/stripe-ruby-mock) to replace common libraries.

### Wrap Up

In conclusion, while requiring effort upfront, decoupling external services from controllers and creating fakes allows for quick tests that still give us confidence that our code works.
