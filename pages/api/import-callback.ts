// pages/api/import-callback.ts
import type { NextApiRequest, NextApiResponse } from 'next'

interface CallbackPayload {
  status: string
  message: string
  recordCount?: number
  platform?: string
  brand?: string
  branch?: string
  dataType?: string
  timestamp?: string
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
    })

    // Di sini bisa simpan status ke database jika perlu
    // Atau update real-time ke frontend via WebSocket/Redis

    return res.status(200).json({
      success: true,
      message: 'Status callback received successfully',
    })
  } catch (error) {
    console.error('[Callback] Error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
