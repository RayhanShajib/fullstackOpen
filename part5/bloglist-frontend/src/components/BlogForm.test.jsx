import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

// ── Exercise 5.16 ─────────────────────────────────────────────────────────────
// The new-blog form calls createBlog with the correct details on submit.
describe('BlogForm (5.16)', () => {
  test('calls createBlog with right details when form is submitted', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    // Locate each input by its associated label text
    const titleInput = screen.getByRole('textbox', { name: /title/i })
    const authorInput = screen.getByRole('textbox', { name: /author/i })
    const urlInput = screen.getByRole('textbox', { name: /url/i })

    await user.type(titleInput, 'A brand new blog post')
    await user.type(authorInput, 'Jane Doe')
    await user.type(urlInput, 'https://example.com/new-blog')

    await user.click(screen.getByText('create'))

    // Handler must have been called exactly once
    expect(createBlog.mock.calls).toHaveLength(1)

    // And the argument must match the typed values
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'A brand new blog post',
      author: 'Jane Doe',
      url: 'https://example.com/new-blog',
    })
  })
})
