// pages/api/import-callback.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { saveCallbackStatus } from './import-status'

interface CallbackPayload {
  status: string
  message: string
  recordCount?: number
  platform?: string
  brand?: string
  branch?: string
  dataType?: string
  timestamp?: string
  sessionId?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload: CallbackPayload = req.body

    console.log('[Callback] Status update from n8n:', {
      status: payload.status,
      message: payload.message,
      platform: payload.platform,
      brand: payload.brand,
      branch: payload.branch,
      dataType: payload.dataType,
      recordCount: payload.recordCount,
      timestamp: payload.timestamp,
      sessionId: payload.sessionId,
    })

    // Simpan status callback untuk diambil oleh frontend
    // Jika sessionId tidak ada, generate dari timestamp + platform + brand
    const sessionId = payload.sessionId || 
      `${payload.timestamp || Date.now()}-${payload.platform}-${payload.brand}`.replace(/[^a-zA-Z0-9-]/g, '-')

    saveCallbackStatus(sessionId, payload.status, payload.message, {
      recordCount: payload.recordCount,
      platform: payload.platform,
      brand: payload.brand,
      branch: payload.branch,
      dataType: payload.dataType,
      timestamp: payload.timestamp,
    })

    return res.status(200).json({
      success: true,
      message: 'Status callback received successfully',
      sessionId,
    })
  } catch (error) {
    console.error('[Callback] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
