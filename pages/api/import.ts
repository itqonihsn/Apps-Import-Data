// pages/api/import.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseCSV, validateCSVStructure } from '@/lib/csvParser'
import { IncomingForm } from 'formidable'
import fs from 'fs/promises'
import FormData from 'form-data'
import axios from 'axios'

interface ImportResponse {
  success?: boolean
  recordCount?: number
  error?: string
  sessionId?: string
  metadata?: {
    platform?: string
    brand?: string
    branch?: string
    dataType?: string
    timestamp?: string
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

// Helper function to get current time in WIB (UTC+7)
function getCurrentTimeWIB(): string {
  const now = new Date()
  // WIB is UTC+7
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000)
  
  const year = wibTime.getUTCFullYear()
  const month = String(wibTime.getUTCMonth() + 1).padStart(2, '0')
  const date = String(wibTime.getUTCDate()).padStart(2, '0')
  const hours = String(wibTime.getUTCHours()).padStart(2, '0')
  const minutes = String(wibTime.getUTCMinutes()).padStart(2, '0')
  const seconds = String(wibTime.getUTCSeconds()).padStart(2, '0')
  const milliseconds = String(wibTime.getUTCMilliseconds()).padStart(3, '0')
  
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}`
}

async function sendToN8N(
  csvContent: string,
  platform: string,
  brand: string,
  branch: string,
  dataType: string,
  recordCount: number,
  callbackUrl: string
): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('[N8N] N8N_WEBHOOK_URL environment variable tidak dikonfigurasi')
    throw new Error('N8N_WEBHOOK_URL environment variable tidak dikonfigurasi')
  }
  
  console.log(`[N8N] Webhook URL configured: ${webhookUrl.substring(0, 50)}...`)

  // Create FormData untuk kirim file + metadata (Node.js compatible)
  const formData = new FormData()
  
  // Add CSV file as buffer - ORIGINAL content without any modification
  const csvBuffer = Buffer.from(csvContent, 'utf-8')
  formData.append('csvFile', csvBuffer, {
    filename: `import_${dataType}_${Date.now()}.csv`,
    contentType: 'text/csv;charset=utf-8',
  })
  
  // Add metadata dengan timestamp WIB
  formData.append('timestamp', getCurrentTimeWIB())
  formData.append('platform', platform)
  formData.append('brand', brand)
  formData.append('branch', branch)
  formData.append('dataType', dataType)
  formData.append('recordCount', recordCount.toString())
  formData.append('callbackUrl', callbackUrl)

  const payloadSize = (csvContent.length / 1024 / 1024).toFixed(2)
  console.log(
    `[N8N] Sending CSV file (${recordCount} records, ${payloadSize} MB)`
  )
  console.log(`[N8N] Metadata: Platform=${platform}, Brand=${brand}, Branch=${branch}, DataType=${dataType}`)
  console.log(`[N8N] Callback URL: ${callbackUrl}`)
  console.log(`[N8N] Timestamp: ${getCurrentTimeWIB()} (WIB)`)

  try {
    // Get headers from form-data (includes Content-Type with boundary)
    const headers = formData.getHeaders()
    
    console.log(`[N8N] Webhook URL: ${webhookUrl}`)
    console.log(`[N8N] Sending request to n8n webhook using axios...`)
    
    // Gunakan axios untuk mengirim FormData - lebih reliable di serverless environment
    // Axios secara otomatis handle FormData stream dengan benar
    try {
      const response = await axios.post(webhookUrl, formData, {
        headers: {
          ...headers,
        },
        timeout: 30000, // 30 detik timeout
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      })

      console.log(`[N8N] Response status: ${response.status} ${response.statusText || 'OK'}`)
      console.log(`[N8N] CSV file sent successfully to n8n webhook. Response: ${JSON.stringify(response.data)}`)
    } catch (axiosError: any) {
      if (axiosError.code === 'ECONNABORTED') {
        console.error(`[N8N] Request timeout after 30 seconds`)
        throw new Error('Request ke n8n timeout setelah 30 detik')
      }
      
      if (axiosError.response) {
        // Server responded with error status
        console.error(`[N8N] Error response: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`)
        throw new Error(`N8N webhook failed: ${axiosError.response.statusText} (${axiosError.response.status}) - ${JSON.stringify(axiosError.response.data)}`)
      } else if (axiosError.request) {
        // Request was made but no response received
        console.error(`[N8N] No response received:`, axiosError.message)
        throw new Error(`N8N webhook tidak merespons: ${axiosError.message}`)
      } else {
        // Error setting up request
        console.error(`[N8N] Request setup error:`, axiosError.message)
        throw new Error(`Error mengirim request ke n8n: ${axiosError.message}`)
      }
    }
  } catch (error) {
    console.error(`[N8N] Error sending CSV:`, error)
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImportResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse form data
    const form = new IncomingForm()
    const [fields, files] = await form.parse(req)

    // Extract fields
    const platform = Array.isArray(fields.platform) ? fields.platform[0] : fields.platform
    const brand = Array.isArray(fields.brand) ? fields.brand[0] : fields.brand
    const branch = Array.isArray(fields.branch) ? fields.branch[0] : fields.branch
    const dataType = Array.isArray(fields.dataType) ? fields.dataType[0] : fields.dataType
    const csvFileArray = files.csvFile

    // Validate required fields
    if (!platform || !brand || !branch || !dataType) {
      return res.status(400).json({ error: 'Field wajib diisi: platform, brand, branch, dataType' })
    }

    if (!csvFileArray || csvFileArray.length === 0) {
      return res.status(400).json({ error: 'CSV file wajib diunggah' })
    }

    const csvFile = csvFileArray[0]
    const fileContent = await fs.readFile(csvFile.filepath, 'utf-8')

    // Parse CSV content
    let csvRecords
    try {
      csvRecords = parseCSV(fileContent)
    } catch (parseError) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'CSV parsing error'
      return res.status(400).json({ error: `CSV parsing error: ${errorMessage}` })
    }

    // Validate CSV structure
    try {
      validateCSVStructure(csvRecords, dataType)
    } catch (validationError) {
      const errorMessage =
        validationError instanceof Error ? validationError.message : 'CSV validation error'
      return res.status(400).json({ error: errorMessage })
    }

    // Build callback URL
    // Di production (Vercel), gunakan production URL
    // Di development, gunakan localhost
    const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
    const apiUrl = isProduction 
      ? (process.env.NEXT_PUBLIC_API_URL || 'https://apps-import-data.vercel.app')
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
    const callbackUrl = `${apiUrl}/api/import-callback`
    
    console.log(`[Import] Environment: ${isProduction ? 'Production' : 'Development'}`)
    console.log(`[Import] Callback URL: ${callbackUrl}`)

    // Send CSV file directly to n8n (not JSON)
    // n8n akan handle parsing CSV sendiri
    await sendToN8N(fileContent, platform, brand, branch, dataType, csvRecords.length, callbackUrl)

    // Generate session ID untuk tracking callback status
    // Format: timestamp-platform-brand-branch (sanitized)
    const timestamp = Date.now()
    const sessionId = `${timestamp}-${platform}-${brand}-${branch}`.replace(/[^a-zA-Z0-9-]/g, '-')
    
    console.log(`[Import] Generated sessionId: ${sessionId}`)

    // Return success response dengan sessionId
    return res.status(200).json({
      success: true,
      recordCount: csvRecords.length,
      sessionId,
      // Kirim juga metadata untuk n8n callback
      metadata: {
        platform,
        brand,
        branch,
        dataType,
        timestamp: getCurrentTimeWIB(),
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return res.status(500).json({ error: errorMessage })
  }
}
