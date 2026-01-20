# Setup HTTP Request Callback di n8n Workflow

## Struktur Workflow yang Disarankan

```
Webhook (Receive Data)
  ↓
Switch (Route berdasarkan Platform/Brand/DataType)
  ↓
Extract From CSV
  ↓
Code (Process Data)
  ↓
Upsert PostgreSQL
  ↓
HTTP Request (Send Callback) ← TAMBAHKAN DI SINI
```

## Opsi 1: Callback Setelah Setiap Upsert (Recommended)

Tambahkan **HTTP Request** node setelah **setiap Upsert** node untuk mengirim callback segera setelah data berhasil di-upsert.

### Keuntungan:
- ✅ Callback langsung setelah setiap branch selesai
- ✅ User tahu status real-time untuk setiap data type
- ✅ Lebih granular tracking

### Kekurangan:
- ⚠️ Banyak HTTP Request nodes (satu per branch)
- ⚠️ Bisa ada multiple callbacks untuk satu import

## Opsi 2: Callback Setelah Semua Upsert Selesai (Alternative)

Tambahkan **Merge** node untuk menggabungkan semua hasil Upsert, lalu tambahkan **HTTP Request** node setelah Merge.

### Struktur:
```
Upsert 1 ──┐
Upsert 2 ──┤
Upsert 3 ──┼──> Merge ──> HTTP Request (Send Callback)
...        │
Upsert N ──┘
```

### Keuntungan:
- ✅ Satu callback untuk satu import
- ✅ Lebih sederhana

### Kekurangan:
- ⚠️ Harus menunggu semua branch selesai
- ⚠️ Jika satu branch gagal, callback mungkin tidak terkirim

## Setup HTTP Request Node

### 1. Tambahkan HTTP Request Node

Setelah node **Upsert PostgreSQL**, klik **+** dan pilih **HTTP Request**.

### 2. Konfigurasi Basic Settings

#### Method
- Pilih: **POST**

#### URL
Gunakan dynamic dari webhook input:
```
{{ $json.callbackUrl }}
```

Atau hardcode:
```
https://apps-import-data.vercel.app/api/import-callback
```

### 3. Headers

Klik **Add Header**:
- **Name**: `Content-Type`
- **Value**: `application/json`

### 4. Body (JSON)

#### Body Content Type
- Pilih: **JSON**

#### JSON Body
Copy paste JSON berikut:

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

**PENTING**: Pastikan `sessionId` sesuai dengan yang dikirim dari aplikasi.

### 5. Options (Optional)

Klik **Options**:
- **Timeout**: `30000` (30 detik)
- **Follow Redirect**: ✅ (checked)

## Cara Mengambil sessionId

### Option A: Dari Webhook Input (Recommended)

Jika webhook menerima `sessionId` dari aplikasi, gunakan:
```json
"sessionId": "{{ $json.sessionId }}"
```

### Option B: Generate dari Metadata

Jika `sessionId` tidak tersedia, generate dari metadata:
```json
"sessionId": "{{ $json.timestamp }}-{{ $json.platform }}-{{ $json.brand }}-{{ $json.branch }}"
```

### Option C: Simpan dari Response Import

Jika workflow memanggil `/api/import` terlebih dahulu, simpan `sessionId` dari response:
1. Setelah HTTP Request ke `/api/import`, response akan berisi `sessionId`
2. Pass `sessionId` ke node berikutnya
3. Gunakan di callback: `{{ $json.sessionId }}`

## Contoh Workflow Lengkap

### Pattern untuk Setiap Branch:

```
Switch (Route)
  ↓
Extract From CSV (Order Clara TikTok)
  ↓
Code (Code Order Clara TikTok)
  ↓
Upsert (Upsert Order Clara TikTok)
  ↓
HTTP Request (POST /api/import-callback)
  ├─ URL: {{ $json.callbackUrl }}
  ├─ Body: {
  │    "status": "success",
  │    "message": "Data sudah masuk dan update ke database",
  │    "recordCount": "{{ $json.recordCount }}",
  │    "platform": "{{ $json.platform }}",
  │    "brand": "{{ $json.brand }}",
  │    "branch": "{{ $json.branch }}",
  │    "dataType": "{{ $json.dataType }}",
  │    "timestamp": "{{ $now.toISO() }}",
  │    "sessionId": "{{ $json.sessionId }}"
  │  }
  └─ Headers: Content-Type: application/json
```

## Error Handling

### Tambahkan Error Trigger (Optional)

Jika ingin handle error, tambahkan **Error Trigger** node:

```
Upsert PostgreSQL
  ↓
HTTP Request (Send Callback)
  ↓
Error Trigger (Jika ada error)
  ↓
HTTP Request (Send Error Callback)
```

### Error Callback JSON:
```json
{
  "status": "error",
  "message": "Gagal memproses data: {{ $json.error.message }}",
  "recordCount": 0,
  "platform": "{{ $json.platform }}",
  "brand": "{{ $json.brand }}",
  "branch": "{{ $json.branch }}",
  "dataType": "{{ $json.dataType }}",
  "timestamp": "{{ $now.toISO() }}",
  "sessionId": "{{ $json.sessionId }}"
}
```

## Testing

1. **Test dengan Sample Data**
   - Execute workflow dengan sample data
   - Cek response dari HTTP Request node
   - Pastikan status code `200`

2. **Cek Logs di Vercel**
   - Buka Vercel Dashboard → Logs
   - Cari log `[Callback] Status update from n8n`
   - Pastikan sessionId dan metadata benar

3. **Cek Aplikasi**
   - Import data dari aplikasi
   - Pastikan polling mendeteksi callback
   - Pastikan SuccessModal muncul

## Troubleshooting

### Callback tidak terkirim
- ✅ Pastikan URL benar: `https://apps-import-data.vercel.app/api/import-callback`
- ✅ Pastikan method adalah `POST`
- ✅ Pastikan header `Content-Type: application/json`
- ✅ Cek logs di n8n untuk error

### sessionId tidak match
- ✅ Pastikan sessionId yang dikirim sama dengan yang di-generate aplikasi
- ✅ Cek format: `timestamp-platform-brand-branch`
- ✅ Pastikan tidak ada karakter khusus

### Multiple callbacks
- ✅ Jika menggunakan Opsi 1 (callback per branch), ini normal
- ✅ Aplikasi akan menggunakan callback terakhir yang diterima
- ✅ Atau gunakan Opsi 2 (satu callback setelah semua selesai)

## Rekomendasi

Untuk workflow Anda yang memiliki banyak branch (Clara TikTok, Hamish TikTok, Heriadi TikTok, dll), saya rekomendasikan:

**Opsi 1**: Tambahkan HTTP Request setelah **setiap Upsert** node
- Lebih reliable
- User tahu status untuk setiap data type
- Jika satu branch gagal, branch lain tetap bisa kirim callback

**Opsi 2**: Jika ingin satu callback saja, tambahkan **Merge** node setelah semua Upsert, lalu HTTP Request setelah Merge.
