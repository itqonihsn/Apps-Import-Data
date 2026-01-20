# Troubleshooting: Notifikasi Tidak Muncul

## Masalah
Log callback sudah masuk di Vercel, tapi notifikasi tidak muncul di frontend.

## Kemungkinan Penyebab

### 1. sessionId Tidak Match (Paling Sering)

**Masalah**: sessionId yang dikirim n8n tidak sama dengan yang di-generate aplikasi.

**Solusi**: Pastikan n8n mengirim sessionId yang sama dengan yang dikirim aplikasi.

#### Format sessionId yang Benar:
```
timestamp-platform-brand-branch
```

Contoh:
```
1737216000000-Lazada-Brighty-Brighty-Official-Store
```

#### Cara Cek sessionId:

1. **Di Browser Console** (setelah import):
   - Buka Developer Tools (F12)
   - Tab Console
   - Cari log: `[Import] Starting polling with sessionId: ...`
   - Copy sessionId tersebut

2. **Di Vercel Logs** (setelah callback):
   - Buka Vercel Dashboard → Logs
   - Cari log: `[Callback] Using provided sessionId: ...` atau `[Callback] Generated sessionId: ...`
   - Bandingkan dengan sessionId dari browser

3. **Di n8n HTTP Request**:
   - Pastikan JSON body mengirim sessionId yang sama
   - Atau generate dengan format yang benar

### 2. sessionId Tidak Dikirim dari n8n

**Masalah**: n8n tidak mengirim sessionId di callback.

**Solusi**: Pastikan JSON body di HTTP Request node n8n menyertakan sessionId:

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

**PENTING**: Jika `$json.sessionId` tidak ada, generate dengan format yang benar:
```json
"sessionId": "{{ $json.timestamp }}-{{ $json.platform }}-{{ $json.brand }}-{{ $json.branch }}"
```

### 3. Polling Tidak Berjalan

**Masalah**: Frontend tidak mulai polling setelah import.

**Cek**:
1. Buka Browser Console (F12)
2. Setelah import, cari log: `[Polling] Starting polling for sessionId: ...`
3. Jika tidak ada, berarti polling tidak dimulai

**Solusi**: Pastikan response dari `/api/import` berisi `sessionId`.

### 4. Status Bukan "success"

**Masalah**: Callback mengirim status selain "success".

**Cek**: Di Vercel logs, cari:
```
[Callback] Status update from n8n: { status: '...' }
```

**Solusi**: Pastikan n8n mengirim `"status": "success"` (bukan "Success" atau "SUCCESS").

## Langkah Debugging

### Step 1: Cek Browser Console

1. Buka aplikasi di browser
2. Buka Developer Tools (F12) → Console
3. Import data
4. Cari log:
   - `[Import] Starting polling with sessionId: ...`
   - `[Polling] Starting polling for sessionId: ...`
   - `[Polling] Checking status: ...`
   - `[Polling] Response: ...`

### Step 2: Cek Vercel Logs

1. Buka Vercel Dashboard
2. Pilih project → Deployments → Pilih deployment terbaru → Logs
3. Cari log:
   - `[Import] Generated sessionId: ...`
   - `[Callback] Using provided sessionId: ...` atau `[Callback] Generated sessionId: ...`
   - `[Status] Looking for sessionId: ...`
   - `[Status] Available sessionIds: ...`

### Step 3: Bandingkan sessionId

1. Copy sessionId dari browser console (setelah import)
2. Copy sessionId dari Vercel logs (setelah callback)
3. Bandingkan - harus sama persis!

### Step 4: Test Manual

Test endpoint status secara manual:

```bash
# Ganti SESSION_ID dengan sessionId yang benar
curl "https://apps-import-data.vercel.app/api/import-status?sessionId=SESSION_ID"
```

Response harus:
```json
{
  "found": true,
  "status": "success",
  "message": "Data sudah masuk dan update ke database",
  ...
}
```

## Solusi Cepat

### Jika sessionId Tidak Match:

**Option 1**: Update n8n untuk mengirim sessionId yang benar
- Pastikan n8n mengambil sessionId dari webhook input
- Atau generate dengan format: `timestamp-platform-brand-branch`

**Option 2**: Update aplikasi untuk generate sessionId yang sama
- Tapi ini lebih sulit karena perlu tahu timestamp yang digunakan n8n

### Rekomendasi:

**Cara Terbaik**: Kirim sessionId dari aplikasi ke n8n, lalu n8n kirim kembali di callback.

1. Aplikasi generate sessionId saat import
2. Aplikasi kirim sessionId ke n8n (bisa via metadata di FormData)
3. n8n simpan sessionId
4. n8n kirim sessionId kembali di callback

## Checklist

- [ ] sessionId dikirim dari aplikasi ke n8n
- [ ] sessionId dikirim kembali dari n8n di callback
- [ ] Format sessionId sama: `timestamp-platform-brand-branch`
- [ ] Status adalah `"success"` (lowercase)
- [ ] Polling dimulai setelah import (cek browser console)
- [ ] Callback diterima (cek Vercel logs)
- [ ] sessionId match antara browser dan Vercel logs

## Test Script

Jalankan script ini untuk test:

```bash
# 1. Import data dari aplikasi
# 2. Copy sessionId dari browser console
# 3. Test endpoint
SESSION_ID="your-session-id-here"
curl "https://apps-import-data.vercel.app/api/import-status?sessionId=$SESSION_ID"
```

Jika response `found: false`, berarti sessionId tidak match atau callback belum diterima.
