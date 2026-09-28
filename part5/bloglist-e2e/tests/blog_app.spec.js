const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

// ─── shared user credentials ──────────────────────────────────────────────────
const USER = { name: 'Test User', username: 'testuser', password: 'secret123' }
const USER2 = { name: 'Another User', username: 'another', password: 'another123' }

// ─── top-level describe ───────────────────────────────────────────────────────
describe('Blog app', () => {
  // Reset the DB and create a fresh user before EVERY test in this file.
  beforeEach(async ({ page, request }) => {
    // 5.18: wipe database
    await request.post('/api/testing/reset')
    // 5.18: seed a user
    await request.post('/api/users', {
      data: USER,
    })
    await page.goto('/')
  })

  // ── 5.17 ─────────────────────────────────────────────────────────────────────
  test('Login form is shown by default', async ({ page }) => {
    // The heading should say "Log in"
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible()
    // The login button should be present
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  // ── 5.18 ─────────────────────────────────────────────────────────────────────
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, USER.username, USER.password)
      await expect(page.getByText(`${USER.name} logged in`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, USER.username, 'wrongpassword')
      // Error notification must appear
      const notification = page.locator('.notification.error')
      await expect(notification).toBeVisible()
      await expect(notification).toContainText('wrong username or password')
      // Logged-in text must NOT appear
      await expect(page.getByText(`${USER.name} logged in`)).not.toBeVisible()
    })
  })

  // ── 5.19 / 5.20 / 5.21 / 5.22 ───────────────────────────────────────────────
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, USER.username, USER.password)
    })

    // 5.19 ──────────────────────────────────────────────────────────────────────
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'A Test Blog Post', 'Playwright Author', 'https://example.com')
      await expect(page.getByText('A Test Blog Post')).toBeVisible()
    })

    // 5.20 ──────────────────────────────────────────────────────────────────────
    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Blog To Like', 'Some Author', 'https://example.com/like')
      })

      test('a blog can be liked', async ({ page }) => {
        // Expand the blog details
        const blogRow = page.locator('.blog').filter({ hasText: 'Blog To Like' })
        await blogRow.getByRole('button', { name: 'view' }).click()

        // Click the like button once
        await blogRow.getByRole('button', { name: 'like' }).click()

        // The likes count should now show 1
        await expect(blogRow.locator('.blog-likes')).toContainText('1')
      })

      // 5.21 ────────────────────────────────────────────────────────────────────
      test('the user who created the blog can delete it', async ({ page }) => {
        // Expand the blog
        const blogRow = page.locator('.blog').filter({ hasText: 'Blog To Like' })
        await blogRow.getByRole('button', { name: 'view' }).click()

        // Handle the window.confirm dialog automatically
        page.on('dialog', (dialog) => dialog.accept())

        await blogRow.getByRole('button', { name: 'remove' }).click()

        // Blog should be gone from the page
        await expect(page.getByText('Blog To Like')).not.toBeVisible()
      })

      // 5.22 ────────────────────────────────────────────────────────────────────
      test('only the creator can see the delete button', async ({ page, request }) => {
        // Create a second user
        await request.post('/api/users', { data: USER2 })

        // Log out the first user
        await page.getByRole('button', { name: 'logout' }).click()

        // Log in as the second user
        await loginWith(page, USER2.username, USER2.password)

        // Expand the blog created by the first user
        const blogRow = page.locator('.blog').filter({ hasText: 'Blog To Like' })
        await blogRow.getByRole('button', { name: 'view' }).click()

        // The "remove" button should NOT be visible for this user
        await expect(blogRow.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
  })

  // ── 5.23 ─────────────────────────────────────────────────────────────────────
  describe('Blog ordering', () => {
    beforeEach(async ({ page, request }) => {
      await loginWith(page, USER.username, USER.password)

      // Create three blogs via the API for speed (bypassing the UI form)
      const loginResponse = await request.post('/api/login', {
        data: { username: USER.username, password: USER.password },
      })
      const { token } = await loginResponse.json()
      const headers = { Authorization: `Bearer ${token}` }

      await request.post('/api/blogs', {
        data: { title: 'Low Likes Blog', author: 'A', url: 'http://a.com', likes: 2 },
        headers,
      })
      await request.post('/api/blogs', {
        data: { title: 'High Likes Blog', author: 'B', url: 'http://b.com', likes: 10 },
        headers,
      })
      await request.post('/api/blogs', {
        data: { title: 'Mid Likes Blog', author: 'C', url: 'http://c.com', likes: 5 },
        headers,
      })

      // Reload so the newly created blogs are fetched from the server
      await page.reload()
    })

    test('blogs are ordered by likes descending', async ({ page }) => {
      const blogRows = page.locator('.blog')

      // Wait until all 3 blogs are rendered
      await expect(blogRows).toHaveCount(3)

      const titles = await blogRows.allTextContents()

      // "High Likes Blog" (10) should come before "Mid Likes Blog" (5)
      // which should come before "Low Likes Blog" (2)
      const highIdx = titles.findIndex((t) => t.includes('High Likes Blog'))
      const midIdx = titles.findIndex((t) => t.includes('Mid Likes Blog'))
      const lowIdx = titles.findIndex((t) => t.includes('Low Likes Blog'))

      expect(highIdx).toBeLessThan(midIdx)
      expect(midIdx).toBeLessThan(lowIdx)
    })
  })
})
