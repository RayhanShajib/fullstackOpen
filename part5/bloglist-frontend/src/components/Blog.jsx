import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    onLike(blog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      onDelete(blog)
    }
  }

  const isCreator =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username || blog.user === currentUser.username)

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-title-author">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div className="blog-details" style={{ display: visible ? '' : 'none' }}>
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user?.name || blog.user?.username}</div>
        {isCreator && (
          <button onClick={handleRemove} style={{ backgroundColor: '#008CBA', color: 'white' }}>
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog
