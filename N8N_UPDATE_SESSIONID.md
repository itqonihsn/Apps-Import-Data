# Update n8n: Gunakan sessionId dari Webhook Input

## Perubahan di Aplikasi

Aplikasi sekarang **mengirim sessionId** ke n8n via FormData metadata. 

## Update n8n HTTP Request Node (Callback)

### Sebelum (Salah):
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

### Sesudah (Benar):
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

**PENTING**: Sekarang gunakan `{{ $json.sessionId }}` langsung dari webhook input, bukan generate sendiri!

## Data yang Diterima n8n dari Webhook

Setelah update, webhook n8n akan menerima:
```json
{
  "csvFile": "...",
  "timestamp": "2025-01-18 12:00:00.000",
  "platform": "Lazada",
  "brand": "Brighty",
  "branch": "Brighty Official Store",
  "dataType": "order",
  "recordCount": "100",
  "callbackUrl": "https://apps-import-data.vercel.app/api/import-callback",
  "sessionId": "1768892186389-Lazada-Brighty-Brighty-Official-Store"  ← BARU!
}
```

## Langkah Update di n8n

1. **Buka HTTP Request node** (yang mengirim callback)
2. **Edit JSON Body**
3. **Ubah sessionId** dari:
   ```json
   "sessionId": "{{ $json.timestamp }}-{{ $json.platform }}-{{ $json.brand }}-{{ $json.branch }}"
   ```
   
   Menjadi:
   ```json
   "sessionId": "{{ $json.sessionId }}"
   ```

4. **Save** dan **Test**

## Verifikasi

Setelah update:
1. Import data dari aplikasi
2. Cek browser console - sessionId: `1768892186389-Lazada-Brighty-Brighty-Official-Store`
3. Cek Vercel logs - sessionId yang diterima callback: `1768892186389-Lazada-Brighty-Brighty-Official-Store`
4. **Harus sama!** ✅

## Troubleshooting

### Jika `$json.sessionId` tidak ada:
- Pastikan aplikasi sudah di-deploy dengan update terbaru
- Pastikan n8n workflow menerima data dari webhook terbaru
- Cek webhook input di n8n - harus ada field `sessionId`

### Jika masih tidak match:
- Cek format sessionId di browser console
- Cek format sessionId di Vercel logs
- Pastikan tidak ada whitespace atau karakter khusus
