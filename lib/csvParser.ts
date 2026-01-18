// lib/csvParser.ts

export interface CsvRecord {
  [key: string]: string
}

export const parseCSV = (fileContent: string): CsvRecord[] => {
  // Handle different line endings (Windows \r\n, Mac \r, Unix \n)
  const normalizedContent = fileContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalizedContent.trim().split('\n')
  
  if (lines.length < 2) {
    throw new Error('CSV file harus memiliki minimal header dan 1 data row')
  }

  // Parse header
  const headers = lines[0]
    .split(',')
    .map(h => h.trim())
    .filter(h => h !== null && h !== undefined) // Remove null/undefined but keep empty strings
  
  if (headers.length === 0) {
    throw new Error('CSV file tidak memiliki header')
  }

  console.log(`[CSV Parser] Header count: ${headers.length}`)

  // Parse data rows
  const records: CsvRecord[] = []
  const columnMismatches: number[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // Skip empty lines
    
    const values = line
      .split(',')
      .map(v => v.trim())
    
    // Flexible column handling
    // If fewer columns: pad with empty strings
    // If more columns: truncate to header length
    while (values.length < headers.length) {
      values.push('')
    }

    if (values.length > headers.length) {
      columnMismatches.push(i + 1)
      // Truncate extra columns
      values.length = headers.length
    }
    
    const record: CsvRecord = {}
    headers.forEach((header, index) => {
      record[header] = values[index] || ''
    })
    
    records.push(record)
  }

  if (records.length === 0) {
    throw new Error('CSV file tidak memiliki data')
  }

  if (columnMismatches.length > 0 && columnMismatches.length < 10) {
    console.warn(`[CSV Parser] Warning: ${columnMismatches.length} baris memiliki kolom tidak konsisten. Baris: ${columnMismatches.join(', ')}`)
  }

  console.log(`[CSV Parser] Successfully parsed ${records.length} records`)

  return records
}

export const validateCSVStructure = (records: CsvRecord[], dataType: string): void => {
  if (records.length === 0) {
    throw new Error('CSV file tidak memiliki data')
  }

  // Get actual headers from first record
  const firstRecord = records[0]
  const actualHeaders = Object.keys(firstRecord)

  // Normalize header names (handle various cases and spaces)
  const normalizedHeaders = actualHeaders.map(h => h.toLowerCase().trim())

  // Define field patterns for each data type (more flexible)
  const requiredPatterns: { [key: string]: RegExp[] } = {
    order: [
      /order|pesanan|no\s*pesanan|id/i,  // Order ID
      /produk|product|nama\s*produk/i,    // Product
      /qty|quantity|jumlah/i,             // Quantity
      /harga|price|total/i,               // Price/Total
    ],
    withdrawal: [
      /withdrawal|penarikan|id/i,         // Withdrawal ID
      /amount|jumlah|total/i,             // Amount
      /date|tanggal|waktu/i,              // Date
    ],
    balance: [
      /date|tanggal|waktu/i,              // Date
      /balance|saldo|jumlah/i,            // Balance
    ],
  }

  const patterns = requiredPatterns[dataType] || []

  // Don't validate strict patterns - just check file has content
  if (actualHeaders.length === 0) {
    throw new Error(`CSV file memiliki header yang kosong`)
  }

  // Just validate that we have some data
  if (actualHeaders.length < 2) {
    throw new Error(
      `CSV file harus memiliki minimal 2 kolom. Saat ini hanya ${actualHeaders.length} kolom`
    )
  }
}
