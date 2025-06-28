import { render, screen, waitFor } from '@testing-library/react'
import Home from '../app/page'

// Mock fetch
global.fetch = jest.fn()

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    // Mock fetch to return a pending promise
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    render(<Home />)
    expect(screen.getByText('Loading programs...')).toBeInTheDocument()
  })

  it('renders programs when API call succeeds', async () => {
    const mockPrograms = [
      {
        id: '1',
        title: 'Morning Show',
        time: '06:00 - 09:00',
        description: 'Start your day with music and news'
      },
      {
        id: '2',
        title: 'Evening News',
        time: '18:00 - 19:00',
        description: 'Daily news update'
      }
    ]

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrograms,
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Morning Show')).toBeInTheDocument()
      expect(screen.getByText('Evening News')).toBeInTheDocument()
      expect(screen.getByText('06:00 - 09:00')).toBeInTheDocument()
      expect(screen.getByText('Start your day with music and news')).toBeInTheDocument()
    })
  })

  it('renders error message when API call fails', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument()
    })
  })

  it('renders "No programs available" when API returns empty array', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('No programs available')).toBeInTheDocument()
    })
  })

  it('renders page title', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    render(<Home />)
    expect(screen.getByText('Radio Program Schedule')).toBeInTheDocument()
  })
})