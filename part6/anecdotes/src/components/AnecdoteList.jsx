import { useAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, deleteAnecdote } = useAnecdoteActions()

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => deleteAnecdote(anecdote.id)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
