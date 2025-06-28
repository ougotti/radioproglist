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
        stationID: 'TBS',
        station_name: 'TBSラジオ',
        day: '2025-06-28',
        ft: '2025-06-28T06:00:00',
        to: '2025-06-28T09:00:00',
        dur: 10800,
        title: 'Morning Show',
        pfm: 'Test Host',
        desc: null,
        info: 'Start your day with music and news',
        tag: ['morning', 'news'],
        url: 'https://example.com'
      },
      {
        id: '2',
        stationID: 'TBS',
        station_name: 'TBSラジオ',
        day: '2025-06-28',
        ft: '2025-06-28T18:00:00',
        to: '2025-06-28T19:00:00',
        dur: 3600,
        title: 'Evening News',
        pfm: 'News Anchor',
        desc: null,
        info: 'Daily news update',
        tag: ['news'],
        url: 'https://example.com'
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

  it('renders mock data when API call fails', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('モーニングショー')).toBeInTheDocument()
      expect(screen.getByText('お昼のニュース')).toBeInTheDocument()
      expect(screen.getByText('イブニングトーク')).toBeInTheDocument()
    }, { timeout: 3000 })
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
