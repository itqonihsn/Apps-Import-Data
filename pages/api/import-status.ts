// pages/api/import-status.ts
import type { NextApiRequest, NextApiResponse } from 'next'

// In-memory store untuk status callback
// Di production, gunakan Redis atau database
const statusStore = new Map<string, {
  status: string
  message: string
  recordCount?: number
  platform?: string
  brand?: string
  branch?: string
  dataType?: string
  timestamp?: string
  receivedAt: number
}>()

// Cleanup old entries setiap 1 jam
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  for (const [key, value] of statusStore.entries()) {
    if (value.receivedAt < oneHourAgo) {
      statusStore.delete(key)
    }
  }
}, 60 * 60 * 1000)

interface StatusResponse {
  status?: string
  message?: string
  recordCount?: number
  platform?: string
  brand?: string
  branch?: string
  dataType?: string
  timestamp?: string
  found?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatusResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ found: false, message: 'Method not allowed' })
  }

  try {
    const { sessionId } = req.query

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ found: false, message: 'Session ID required' })
    }

    console.log(`[Status] Looking for sessionId: ${sessionId}`)
    console.log(`[Status] Available sessionIds:`, Array.from(statusStore.keys()))

    const status = statusStore.get(sessionId)

    if (!status) {
      console.log(`[Status] SessionId not found: ${sessionId}`)
      return res.status(200).json({ found: false })
    }

    console.log(`[Status] Found status for sessionId: ${sessionId}`, status)

    return res.status(200).json({
      found: true,
      status: status.status,
      message: status.message,
      recordCount: status.recordCount,
      platform: status.platform,
      brand: status.brand,
      branch: status.branch,
      dataType: status.dataType,
      timestamp: status.timestamp,
    })
  } catch (error) {
    console.error('[Status] Error:', error)
    return res.status(500).json({
      found: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

// Export function untuk menyimpan status dari callback
export function saveCallbackStatus(
  sessionId: string,
  status: string,
  message: string,
  metadata?: {
    recordCount?: number
    platform?: string
    brand?: string
    branch?: string
    dataType?: string
    timestamp?: string
  }
) {
  statusStore.set(sessionId, {
    status,
    message,
    ...metadata,
    receivedAt: Date.now(),
  })
  
  console.log(`[Status] Saved callback status for session: ${sessionId}`)
}
