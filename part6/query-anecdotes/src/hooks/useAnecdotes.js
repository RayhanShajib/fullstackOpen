import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'
import { useNotify } from '../NotificationContext'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      if (anecdotes) {
        queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      } else {
        queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      }
      notify(`anecdote '${newAnecdote.content}' created`)
    },
    onError: (error) => {
      notify(error.message)
    },
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      if (anecdotes) {
        queryClient.setQueryData(
          ['anecdotes'],
          anecdotes.map((a) => (a.id === updatedAnecdote.id ? updatedAnecdote : a))
        )
      } else {
        queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      }
      notify(`anecdote '${updatedAnecdote.content}' voted`)
    },
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => newAnecdoteMutation.mutate({ content, votes: 0 }),
    vote: (anecdote) => voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
  }
}
