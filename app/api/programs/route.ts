import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const stationId = searchParams.get('stationId')
  
  if (!stationId) {
    return NextResponse.json({ error: 'stationId is required' }, { status: 400 })
  }

  try {
    const apiUrl = `https://v8pwp7d7bd.execute-api.ap-northeast-1.amazonaws.com/prod/programs?stationId=${stationId}`
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' }, 
      { status: 500 }
    )
  }
}
