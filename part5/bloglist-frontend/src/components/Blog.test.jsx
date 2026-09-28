import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Testing React applications',
  author: 'Firstname Lastname',
  url: 'https://example.com/testing-react',
  likes: 7,
  user: { name: 'Test User', username: 'testuser' },
}

// ── Exercise 5.13 ─────────────────────────────────────────────────────────────
// By default the blog renders title + author but NOT the url or likes count.
describe('Blog component – default rendering (5.13)', () => {
  beforeEach(() => {
    render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} currentUser={null} />)
  })

  test('renders the title', () => {
    expect(screen.getByText(/Testing React applications/i)).toBeDefined()
  })

  test('renders the author', () => {
    expect(screen.getByText(/Firstname Lastname/i)).toBeDefined()
  })

  test('does not show URL by default', () => {
    const details = document.querySelector('.blog-details')
    expect(details).not.toBeVisible()
  })

  test('does not show likes by default', () => {
    const details = document.querySelector('.blog-details')
    expect(details).not.toBeVisible()
  })
})

// ── Exercise 5.14 ─────────────────────────────────────────────────────────────
// After clicking the toggle button, url AND likes are shown.
describe('Blog component – expanded view (5.14)', () => {
  beforeEach(async () => {
    render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} currentUser={null} />)
    const user = userEvent.setup()
    await user.click(screen.getByText('view'))
  })

  test('shows the URL after clicking view', () => {
    expect(screen.getByText('https://example.com/testing-react')).toBeVisible()
  })

  test('shows the likes after clicking view', () => {
    const likesEl = document.querySelector('.blog-likes')
    expect(likesEl).toBeVisible()
    expect(likesEl).toHaveTextContent('7')
  })
})

// ── Exercise 5.15 ─────────────────────────────────────────────────────────────
// Clicking the like button twice calls the event handler exactly twice.
describe('Blog component – like button (5.15)', () => {
  test('like handler is called twice when button is clicked twice', async () => {
    const mockLike = vi.fn()
    render(<Blog blog={blog} onLike={mockLike} onDelete={() => {}} currentUser={null} />)

    const user = userEvent.setup()

    // Expand to make the like button visible
    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})
