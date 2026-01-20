# Setup n8n HTTP Request Node (Manual - Tanpa Import cURL)

Karena import cURL tidak bekerja, setup manual lebih mudah dan lebih fleksibel.

## Langkah Setup di n8n

### 1. Tambahkan HTTP Request Node
- Setelah node **Upsert PostgreSQL**
- Klik **+** untuk tambah node baru
- Pilih **HTTP Request**

### 2. Konfigurasi Basic Settings

#### Method
- Pilih: **POST**

#### URL
Pilih salah satu:
- **Option 1 (Recommended)**: Gunakan dynamic dari webhook
  ```
  {{ $json.callbackUrl }}
  ```
- **Option 2**: Hardcode URL
  ```
  https://apps-import-data.vercel.app/api/import-callback
  ```

### 3. Konfigurasi Headers

Klik **Add Header**:
- **Name**: `Content-Type`
- **Value**: `application/json`

### 4. Konfigurasi Body

#### Body Content Type
- Pilih: **JSON**

#### JSON Body
Copy paste JSON berikut dan sesuaikan dengan expression `{{ }}`:

```json
{
  "status": "success",
  "message": "Data sudah masuk dan update ke database",
  "recordCount": "{{ $json.recordCount }}",
  "platform": "{{ $json.platform }}",
  "brand": "{{ $json.brand }}",
  "branch": "{{ $json.branch }}",
  "dataType": "{{ $json.dataType }}",
  "timestamp": "{{ $now.toISO() }}",
  "sessionId": "{{ $json.timestamp }}-{{ $json.platform }}-{{ $json.brand }}"
}
```

**PENTING**: `sessionId` harus sesuai dengan yang dikirim dari aplikasi. Jika tidak ada di webhook input, generate dari timestamp + platform + brand.

**Atau jika menggunakan Expression Editor** (lebih advanced):
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

### 5. Options (Optional)

Klik **Options** untuk advanced settings:
- **Timeout**: `30000` (30 detik)
- **Follow Redirect**: ✅ (checked)
- **Ignore SSL Issues**: ❌ (unchecked, kecuali ada masalah SSL)

### 6. Test Node

1. Klik **Execute Node** untuk test
2. Cek response di output
3. Pastikan status code `200` dan response:
   ```json
   {
     "success": true,
     "message": "Status callback received successfully"
   }
   ```

## Contoh Data Input dari Previous Node

Data yang diterima dari webhook (sebelumnya):
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

## Workflow Structure

```
┌─────────────────┐
│   Webhook       │ ← Receive data dari aplikasi
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Extract From CSV│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Code          │ ← Process data
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Upsert PostgreSQL│ ← Insert/Update ke database
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  HTTP Request   │ ← KIRIM CALLBACK KE SINI
│  (Send Callback)│
└─────────────────┘
```

## Troubleshooting

### Error: Connection refused
- Pastikan URL benar: `https://apps-import-data.vercel.app/api/import-callback`
- Cek apakah aplikasi sudah di-deploy di Vercel

### Error: Timeout
- Increase timeout di Options menjadi `60000` (60 detik)

### Error: Invalid JSON
- Pastikan menggunakan double quotes `"` bukan single quotes `'`
- Pastikan semua field dalam JSON valid

### Data tidak terkirim
- Pastikan menggunakan expression `{{ $json.fieldName }}` untuk dynamic values
- Cek output dari previous node untuk memastikan data tersedia

## Testing

Setelah setup, test dengan:
1. Execute workflow dengan sample data
2. Cek response dari HTTP Request node
3. Cek logs di Vercel untuk memastikan callback diterima
4. Pastikan message muncul di aplikasi

## Alternative: Menggunakan Code Node

Jika HTTP Request node masih bermasalah, bisa menggunakan Code node dengan fetch:

```javascript
const callbackUrl = $json.callbackUrl || 'https://apps-import-data.vercel.app/api/import-callback';

const response = await fetch(callbackUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'success',
    message: 'Data sudah masuk dan update ke database',
    recordCount: $json.recordCount,
    platform: $json.platform,
    brand: $json.brand,
    branch: $json.branch,
    dataType: $json.dataType,
    timestamp: new Date().toISOString(),
  }),
});

const result = await response.json();
return { json: result };
```
