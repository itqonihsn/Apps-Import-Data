# Setup n8n HTTP Request untuk Callback

## Endpoint Callback
```
POST https://apps-import-data.vercel.app/api/import-callback
```

## Format Payload
```json
{
  "status": "success",
  "message": "Data sudah masuk dan update ke database",
  "recordCount": 100,
  "platform": "Lazada",
  "brand": "Brighty",
  "branch": "Brighty Official Store",
  "dataType": "order",
  "timestamp": "2025-01-18 12:00:00.000"
}
```

## Curl Command untuk Testing

### Success Response
```bash
curl -X POST https://apps-import-data.vercel.app/api/import-callback \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "message": "Data sudah masuk dan update ke database",
    "recordCount": 100,
    "platform": "Lazada",
    "brand": "Brighty",
    "branch": "Brighty Official Store",
    "dataType": "order",
    "timestamp": "2025-01-18 12:00:00.000"
  }'
```

### Error Response (contoh)
```bash
curl -X POST https://apps-import-data.vercel.app/api/import-callback \
  -H "Content-Type: application/json" \
  -d '{
    "status": "error",
    "message": "Gagal memproses data: Database connection failed",
    "recordCount": 0,
    "platform": "Lazada",
    "brand": "Brighty",
    "branch": "Brighty Official Store",
    "dataType": "order",
    "timestamp": "2025-01-18 12:00:00.000"
  }'
```

## Konfigurasi n8n HTTP Request Node

### 1. Setup HTTP Request Node
- **Method**: `POST`
- **URL**: `{{ $json.callbackUrl }}` (ambil dari webhook input sebelumnya)
  - Atau hardcode: `https://apps-import-data.vercel.app/api/import-callback`

### 2. Headers
```
Content-Type: application/json
```

### 3. Body (JSON)
```json
{
  "status": "success",
  "message": "Data sudah masuk dan update ke database",
  "recordCount": "{{ $json.recordCount }}",
  "platform": "{{ $json.platform }}",
  "brand": "{{ $json.brand }}",
  "branch": "{{ $json.branch }}",
  "dataType": "{{ $json.dataType }}",
  "timestamp": "{{ $now.toISO() }}"
}
```

### 4. Expression untuk n8n (Advanced)
Jika menggunakan Expression Editor di n8n:
```javascript
{
  "status": "success",
  "message": "Data sudah masuk dan update ke database",
  "recordCount": $json.recordCount,
  "platform": $json.platform,
  "brand": $json.brand,
  "branch": $json.branch,
  "dataType": $json.dataType,
  "timestamp": $now.toISO()
}
```

## Workflow n8n Structure

```
Webhook (Receive Data)
  ↓
Extract From CSV
  ↓
Code (Process Data)
  ↓
Upsert PostgreSQL
  ↓
HTTP Request (Send Callback) ← SETUP DI SINI
```

## Langkah Setup di n8n

1. **Tambahkan HTTP Request Node** setelah Upsert PostgreSQL node
2. **Method**: Pilih `POST`
3. **URL**: 
   - Option 1: Gunakan `{{ $json.callbackUrl }}` dari webhook input
   - Option 2: Hardcode `https://apps-import-data.vercel.app/api/import-callback`
4. **Authentication**: None (atau Basic jika diperlukan)
5. **Send Headers**: 
   - Key: `Content-Type`
   - Value: `application/json`
6. **Send Body**: 
   - Body Content Type: `JSON`
   - Body: Gunakan JSON di atas dengan expression `{{ }}` untuk dynamic values

## Contoh Data dari Webhook Input

Data yang diterima n8n dari webhook:
```json
{
  "csvFile": "...",
  "timestamp": "2025-01-18 12:00:00.000",
  "platform": "Lazada",
  "brand": "Brighty",
  "branch": "Brighty Official Store",
  "dataType": "order",
  "recordCount": "100",
  "callbackUrl": "https://apps-import-data.vercel.app/api/import-callback"
}
```

## Response yang Diharapkan

### Success (200 OK)
```json
{
  "success": true,
  "message": "Status callback received successfully"
}
```

### Error (500)
```json
{
  "error": "Error message"
}
```

## Tips

1. **Gunakan Try-Catch**: Wrap HTTP Request node dengan Error Trigger untuk handle error
2. **Logging**: Tambahkan log sebelum HTTP Request untuk debugging
3. **Timeout**: Set timeout yang cukup (minimal 30 detik)
4. **Retry**: Jika gagal, bisa setup retry mechanism

## Testing di n8n

1. Test workflow dengan sample data
2. Cek response dari HTTP Request node
3. Cek logs di Vercel untuk memastikan callback diterima
4. Pastikan message muncul di aplikasi (jika ada real-time update)
