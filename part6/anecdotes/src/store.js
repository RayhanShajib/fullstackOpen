import { create } from 'zustand'
import anecdoteService from './services/anecdotes'
import useNotificationStore from './notificationStore'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    addAnecdote: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
      useNotificationStore.getState().actions.showNotification(`you created '${content}'`, 5)
    },
    vote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      if (anecdote) {
        const updated = await anecdoteService.update(id, {
          ...anecdote,
          votes: anecdote.votes + 1,
        })
        set((state) => ({
          anecdotes: state.anecdotes.map(a => (a.id === id ? updated : a)),
        }))
        useNotificationStore.getState().actions.showNotification(`you voted '${anecdote.content}'`, 5)
      }
    },
    deleteAnecdote: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id),
      }))
    },
    setFilter: (filter) => set(() => ({ filter })),
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  const filtered = filter
    ? anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
    : anecdotes
  return filtered.toSorted((a, b) => b.votes - a.votes)
}

export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export default useAnecdoteStore
