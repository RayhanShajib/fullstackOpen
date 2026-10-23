import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, render, screen, cleanup } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, {
  useAnecdotes,
  useAnecdoteActions,
} from './store'
import AnecdoteList from './components/AnecdoteList'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('Anecdotes unit tests', () => {
  // 6.12 Anecdotes, step11
  it('state is initialized with the anecdotes returned by the backend', async () => {
    const mockAnecdotes = [
      { id: '1', content: 'Test anecdote 1', votes: 2 },
      { id: '2', content: 'Test anecdote 2', votes: 5 },
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toHaveLength(2)
    expect(anecdotesResult.current).toEqual([
      { id: '2', content: 'Test anecdote 2', votes: 5 },
      { id: '1', content: 'Test anecdote 1', votes: 2 },
    ])
  })

  // 6.13 Anecdotes, step12
  it('component displaying anecdotes receives the anecdotes from the store sorted by votes', () => {
    const unorderedAnecdotes = [
      { id: '1', content: 'Low votes', votes: 1 },
      { id: '2', content: 'High votes', votes: 10 },
      { id: '3', content: 'Medium votes', votes: 5 },
    ]
    useAnecdoteStore.setState({ anecdotes: unorderedAnecdotes, filter: '' })

    const { container } = render(<AnecdoteList />)
    const renderedTexts = Array.from(
      container.querySelectorAll('div > div > div:first-child')
    ).map((el) => el.textContent)

    expect(renderedTexts).toEqual(['High votes', 'Medium votes', 'Low votes'])

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current.map((a) => a.content)).toEqual([
      'High votes',
      'Medium votes',
      'Low votes',
    ])
  })

  // 6.14 Anecdotes, step13
  it('correct React component receives a properly filtered list of anecdotes', () => {
    const sampleAnecdotes = [
      { id: '1', content: 'React is awesome', votes: 1 },
      { id: '2', content: 'Redux is complex', votes: 3 },
      { id: '3', content: 'Zustand is simple and react friendly', votes: 2 },
    ]
    useAnecdoteStore.setState({ anecdotes: sampleAnecdotes, filter: 'react' })

    render(<AnecdoteList />)
    expect(screen.getByText('React is awesome')).toBeDefined()
    expect(screen.getByText('Zustand is simple and react friendly')).toBeDefined()
    expect(screen.queryByText('Redux is complex')).toBeNull()

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(2)
    expect(result.current.map((a) => a.id)).toEqual(['3', '1'])
  })

  // 6.15 Anecdotes, step14
  it('voting increases the number of votes for an anecdote', async () => {
    const initial = { id: '1', content: 'Vote for me', votes: 0 }
    useAnecdoteStore.setState({ anecdotes: [initial], filter: '' })

    const updatedAnecdote = { ...initial, votes: 1 }
    anecdoteService.update.mockResolvedValue(updatedAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.vote('1')
    })

    expect(anecdoteService.update).toHaveBeenCalledWith('1', {
      ...initial,
      votes: 1,
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)
  })
})
