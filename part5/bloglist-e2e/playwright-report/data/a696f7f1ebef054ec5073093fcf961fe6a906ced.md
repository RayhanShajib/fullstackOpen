# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog_app.spec.js >> Blog app >> Login >> fails with wrong credentials
- Location: tests/blog_app.spec.js:36:5

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