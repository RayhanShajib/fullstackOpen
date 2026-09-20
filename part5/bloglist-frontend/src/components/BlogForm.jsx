const BlogForm = ({
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      <label>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={handleTitleChange}
        />
      </label>
    </div>
    <div>
      <label>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={handleAuthorChange}
        />
      </label>
    </div>
    <div>
      <label>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={handleUrlChange}
        />
      </label>
    </div>
    <button type="submit">create</button>
  </form>
)

export default BlogForm
