import { useAnecdotes } from '../hooks/useAnecdotes'

const AnecdoteForm = ({ onAdd }) => {
  const { addAnecdote: hookAddAnecdote } = useAnecdotes()
  const addAnecdote = onAdd || hookAddAnecdote

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    addAnecdote(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm