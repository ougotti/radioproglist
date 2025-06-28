'use client'

import { useState, useEffect } from 'react'

interface Program {
  id: string
  title: string
  time: string
  description?: string
}

export default function Home() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        // API endpoint will be configured via environment variable
        const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || '/api/programs'
        const response = await fetch(apiEndpoint)
        
        if (!response.ok) {
          throw new Error('Failed to fetch programs')
        }
        
        const data = await response.json()
        setPrograms(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  if (loading) return <div className="loading">Loading programs...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <main className="container">
      <h1>Radio Program Schedule</h1>
      <div className="programs">
        {programs.length === 0 ? (
          <p>No programs available</p>
        ) : (
          programs.map((program) => (
            <div key={program.id} className="program-card">
              <h2>{program.title}</h2>
              <p className="time">{program.time}</p>
              {program.description && (
                <p className="description">{program.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  )
}