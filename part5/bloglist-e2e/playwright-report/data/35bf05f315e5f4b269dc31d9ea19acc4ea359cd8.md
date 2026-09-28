# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog_app.spec.js >> Blog app >> When logged in >> a new blog can be created
- Location: tests/blog_app.spec.js:54:5

# Error details

```
AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:5173
connect ECONNREFUSED 127.0.0.1:5173
Call log:
  - → POST http://localhost:5173/api/testing/reset
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br

```

```
Test timeout of 10000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Test ended.
Call log:
  - waiting for getByRole('button', { name: 'login' })

```

# Test source

```ts
  1  | /**
  2  |  * Helper functions shared across all blog app E2E tests.
  3  |  */
  4  | 
  5  | /**
  6  |  * Log in via the UI login form.
  7  |  * @param {import('@playwright/test').Page} page
  8  |  * @param {string} username
  9  |  * @param {string} password
  10 |  */
  11 | const loginWith = async (page, username, password) => {
> 12 |   await page.getByRole('button', { name: 'login' }).click()
     |                                                     ^ Error: locator.click: Test ended.
  13 |   await page.getByLabel('username').fill(username)
  14 |   await page.getByLabel('password').fill(password)
  15 |   await page.getByRole('button', { name: 'login' }).click()
  16 | }
  17 | 
  18 | /**
  19 |  * Create a blog via the UI form (user must already be logged in).
  20 |  * Waits for the blog title to appear in the list before returning.
  21 |  * @param {import('@playwright/test').Page} page
  22 |  * @param {string} title
  23 |  * @param {string} author
  24 |  * @param {string} url
  25 |  */
  26 | const createBlog = async (page, title, author, url) => {
  27 |   await page.getByRole('button', { name: 'new blog' }).click()
  28 |   await page.getByRole('textbox', { name: /title/i }).fill(title)
  29 |   await page.getByRole('textbox', { name: /author/i }).fill(author)
  30 |   await page.getByRole('textbox', { name: /url/i }).fill(url)
  31 |   await page.getByRole('button', { name: 'create' }).click()
  32 |   // Wait until the newly created blog appears in the list
  33 |   await page.getByText(title).waitFor()
  34 | }
  35 | 
  36 | module.exports = { loginWith, createBlog }
  37 | 
```