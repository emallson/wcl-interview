## WCL Interview Project

A basic project to load and display data from the most recent parse for a character.

Before you dig in, I'd like to acknowledge that _I've never used Laravel
before._ The last time I used PHP in any serious capacity was 2010-ish and the
ecosystem has progressed _significantly_ since then (and thank goodness for
that!).

I instantiated the project using the Laravel-React template, which includes a
lot of cruft that I don't need. I removed parts of it that were obviously
unnecessary, but the prevalence of dependency injection makes me wary of just
deleting large chunks of the `app` folder so a large chunk of that still
remains.

### Running

Copy `.env.example` to `.env` and set `WCL_API_KEY` to your v1 API key.

This uses `sail` with PHP 8.1. I am using the vendored copy from the Laravel starter project, @ me if there are issues with the copy you've got.

```
sail up -d
sail artisan migrate
sail npm install
sail npm run hot
```

Then navigate to `http://localhost`.

### Key Pieces

-   [`ParseController`](app/Http/Controllers/ParseController.php) - main controller used to look up latest parses
-   [`routes/web.php`](routes/web.php) - frontend routes, including injection of cached data
-   [`routes/api.php`](routes/api.php) - minimal API route. not much to see
-   [`resources/js/`](resources/js) - the bulk of the code written. see the `Pages/` subdirectory for the two views used.

### Reflection: Challenges

The most challenging piece of this project was honestly just learning Laravel.
Laravel is a _big_ framework that is opt-out (i.e. it gives you _everything_
unless you ask otherwise---it installed **SIX** services the first time I spun
up a Laravel project!), which means it has a significant surface area to learn.
Additionally, the Laravel documentation is honestly...not great. There's a lot
of text spent covering advanced features and a relative dearth of "here is how
you create a basic table using our ORM". That left me consulting with a variety
of resources outside of the main Laravel site, and dealing with the fact that
many of them are out of date.

That said: once I got over the initial hump and understood how Laravel
organizes things, it was reasonably pleasant to work with. PHP is still an
awkward language, but I'm a sucker for anything with a batteries-included
testing framework and this fits the bill (see the `ParseController`
tests---database and HTTP facades built-in? _swoon_).

### Reflection: Things I Wish I'd Done

1. Delete about 10,000 more lines of Laravel starter-project cruft that I'm not using.
2. Explored Laravel's `Cache` facade for use instead of Postgres as a cache
   layer (did approximately 30 seconds of looking at it, and just went with
   what I knew instead).
3. Frontend tests (there are none).
4. Remove tailwind (I used `styled-components`, but tailwind does a bunch of
   resets that I relied on for this so I can't just delete without replicating
   that)
