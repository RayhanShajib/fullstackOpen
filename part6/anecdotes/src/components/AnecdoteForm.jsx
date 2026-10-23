import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdoteActions()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    if (content.trim()) {
      await addAnecdote(content)
      e.target.reset()
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
