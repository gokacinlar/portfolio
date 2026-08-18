# My Portfolio Website

* * *

This is my own portfolio site which I'll be using to briefly introduce myself to world and for people who need to contact me. It'll include;

* A proper UI interface
* A proper blog (like anecdotes containing fixed length with limited scope & lengthy articles) **powered by Headless WordPress**.
* Course Management for education purposes

| Feature                 | Status |
| ----------------------- | ------ |
| LMS                     | ❌      |
| Courses via WooCommerce | ❌      |

## What I'm planning to use in it?

Site will primarily use;

* HTMX (for SPAish interaction)
* Bootstrap
* Custom Web Components
* Headless WordPress for Back-end Stuff *(Blogs, Woo, LMS etc.)*
* GraphQL
* A feed timeline similar to Xitter timeline
* An image timeline similar to Instagram gallery
* An admin panel (single user, me :3)
* PHP for server-side implementations

> As this project doesn't require that many entitlement on fancy libraries, **minimal usage of external resources** as well as **maximizing native platforms** was primary choice & motivation for me.

## How to clone and run your own local copy?

There are few steps **before you begin:**

* Install [composer](https://getcomposer.org/download/) *since we'll also be needing PHP libraries*.
* After installing the composer, simply run:
  * `composer require --dev roave/security-advisories:dev-latest` *for extra security measures...*

```Bash
npm i
npm run composer:install
npm run dev
npm run live

# For production
npm run build
```
