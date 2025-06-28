'use client'

import { useState, useEffect } from 'react'

const RADIO_STATIONS = [
  { id: 'TBS', name: 'TBSラジオ' },
  { id: 'QRR', name: '文化放送' },
  { id: 'LFR', name: 'ニッポン放送' },
  { id: 'INT', name: 'InterFM897' },
  { id: 'RN1', name: 'ラジオNIKKEI第1' },
  { id: 'RN2', name: 'ラジオNIKKEI第2' },
  { id: 'FMT', name: 'TOKYO FM' },
  { id: 'FMJ', name: 'J-WAVE' },
  { id: 'JORF', name: 'ラジオ日本' },
  { id: 'BAYFM78', name: 'bayfm' },
  { id: 'NACK5', name: 'NACK5' },
  { id: 'JOAK', name: 'NHKラジオ第1' },
  { id: 'YFM', name: 'FMヨコハマ' },
  { id: 'JOAK-FM', name: 'NHK FM' },
  { id: 'IBS', name: '茨城放送' }
]

interface Program {
  id: string
  stationID: string
  station_name: string
  day: string
  ft: string
  to: string
  dur: number
  title: string
  pfm: string
  desc: string | null
  info: string
  tag: string[]
  url: string
}

export default function Home() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStation, setSelectedStation] = useState('TBS')

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true)
        
        const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://v8pwp7d7bd.execute-api.ap-northeast-1.amazonaws.com/prod/programs'
        let response
        
        response = await fetch(`${apiEndpoint}?stationId=${selectedStation}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch programs')
        }
        
        const data = await response.json()
        setPrograms(data)
      } catch (err) {
        console.warn('API call failed, using mock data:', err)
        const mockData = generateMockData(selectedStation)
        setPrograms(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [selectedStation])

  const generateMockData = (stationId: string): Program[] => {
    const stationName = RADIO_STATIONS.find(s => s.id === stationId)?.name || stationId
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    return [
      {
        id: `${stationId}-1`,
        stationID: stationId,
        station_name: stationName,
        day: today,
        ft: `${today}T06:00:00`,
        to: `${today}T09:00:00`,
        dur: 10800,
        title: 'モーニングショー',
        pfm: 'メインパーソナリティ',
        desc: null,
        info: '朝の情報番組です。ニュース、天気、音楽をお届けします。',
        tag: ['morning', 'news', 'music'],
        url: 'https://example.com'
      },
      {
        id: `${stationId}-2`,
        stationID: stationId,
        station_name: stationName,
        day: today,
        ft: `${today}T12:00:00`,
        to: `${today}T13:00:00`,
        dur: 3600,
        title: 'お昼のニュース',
        pfm: 'ニュースキャスター',
        desc: null,
        info: '正午のニュースをお伝えします。',
        tag: ['news'],
        url: 'https://example.com'
      },
      {
        id: `${stationId}-3`,
        stationID: stationId,
        station_name: stationName,
        day: today,
        ft: `${today}T18:00:00`,
        to: `${today}T20:00:00`,
        dur: 7200,
        title: 'イブニングトーク',
        pfm: 'トークホスト',
        desc: null,
        info: '夕方のトーク番組。ゲストとの対談や音楽をお楽しみください。',
        tag: ['talk', 'music', 'guest'],
        url: 'https://example.com'
      }
    ]
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  return (
    <main className="container">
      <h1>Radio Program Schedule</h1>
      
      <div className="station-selector">
        <label htmlFor="station-select">ラジオ局を選択:</label>
        <select 
          id="station-select"
          value={selectedStation} 
          onChange={(e) => setSelectedStation(e.target.value)}
          className="station-select"
        >
          {RADIO_STATIONS.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Loading programs...</div>}
      {error && <div className="error">Error: {error}</div>}
      
      {!loading && !error && (
        <div className="programs">
          {programs.length === 0 ? (
            <p>No programs available</p>
          ) : (
            programs.map((program) => (
              <div key={program.id} className="program-card">
                <h2>{program.title}</h2>
                <p className="time">
                  {formatTime(program.ft)} - {formatTime(program.to)}
                </p>
                <p className="station">{program.station_name}</p>
                {program.pfm && <p className="performer">出演: {program.pfm}</p>}
                {program.info && (
                  <div className="description" dangerouslySetInnerHTML={{ __html: program.info }} />
                )}
                {program.tag && program.tag.length > 0 && (
                  <div className="tags">
                    {program.tag.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </main>
  )
}
