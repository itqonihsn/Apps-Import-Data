# Update n8n untuk Mengirim sessionId di Callback

## Penting: Update JSON Body di HTTP Request Node

Setelah aplikasi mengirim data ke n8n, aplikasi akan mengembalikan `sessionId` yang perlu dikirim kembali di callback.

### Option 1: Simpan sessionId dari Response Import (Recommended)

Jika n8n workflow menerima response dari aplikasi (setelah import), ambil sessionId dari response tersebut:

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
  "sessionId": "{{ $json.sessionId }}"
}
```

### Option 2: Generate sessionId dari Metadata (Fallback)

Jika sessionId tidak tersedia, generate dari metadata yang ada:

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
  "sessionId": "{{ $json.timestamp }}-{{ $json.platform }}-{{ $json.brand }}-{{ $json.branch }}"
}
```

**Format sessionId**: `timestamp-platform-brand-branch` (tanpa karakter khusus)

## Workflow Structure yang Disarankan

```
Webhook (Receive Data)
  ↓
Extract From CSV
  ↓
Code (Process Data)
  ↓
HTTP Request (POST ke /api/import) ← Simpan response.sessionId
  ↓
Upsert PostgreSQL
  ↓
HTTP Request (POST ke /api/import-callback) ← Gunakan sessionId dari response sebelumnya
```

## Cara Mengambil sessionId dari Response

1. Setelah HTTP Request ke `/api/import`, response akan berisi:
   ```json
   {
     "success": true,
     "recordCount": 100,
     "sessionId": "1234567890-Lazada-Brighty-Brighty-Official-Store"
   }
   ```

2. Simpan sessionId di variable atau pass ke node berikutnya

3. Gunakan di callback HTTP Request:
   ```json
   {
     "sessionId": "{{ $json.sessionId }}"
   }
   ```

## Testing

Setelah update, test workflow:
1. Import data dari aplikasi
2. Cek apakah callback diterima dengan sessionId yang benar
3. Pastikan notifikasi muncul di aplikasi setelah callback
