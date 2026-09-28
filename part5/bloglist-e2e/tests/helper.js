/**
 * Helper functions shared across all blog app E2E tests.
 */

/**
 * Log in via the UI login form.
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 */
const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

/**
 * Create a blog via the UI form (user must already be logged in).
 * Waits for the blog title to appear in the list before returning.
 * @param {import('@playwright/test').Page} page
 * @param {string} title
 * @param {string} author
 * @param {string} url
 */
const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByRole('textbox', { name: /title/i }).fill(title)
  await page.getByRole('textbox', { name: /author/i }).fill(author)
  await page.getByRole('textbox', { name: /url/i }).fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  // Wait until the newly created blog appears in the list
  await page.getByText(title).waitFor()
}

module.exports = { loginWith, createBlog }
