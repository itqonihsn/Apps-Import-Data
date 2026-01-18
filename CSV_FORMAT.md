# CSV File Format Documentation

Aplikasi mendukung import 3 jenis data dengan format CSV yang berbeda.

## Data Order

**Nama file**: `data_order.csv`

**Format CSV** (Header wajib sesuai persis):
```csv
order_id,product,quantity,price,date
ORD001,Produk A,5,50000,2024-01-18
ORD002,Produk B,2,75000,2024-01-18
ORD003,Produk A,3,50000,2024-01-18
```

**Field Requirements**:
- `order_id`: ID unik untuk setiap order (String)
- `product`: Nama produk (String)
- `quantity`: Jumlah barang (Number)
- `price`: Harga satuan (Number)
- `date`: Tanggal order (Format: YYYY-MM-DD)

---

## Data Penarikan (Withdrawal)

**Nama file**: `data_withdrawal.csv`

**Format CSV** (Header wajib sesuai persis):
```csv
withdrawal_id,amount,date,status
WD001,500000,2024-01-18,completed
WD002,750000,2024-01-18,completed
WD003,1000000,2024-01-18,pending
```

**Field Requirements**:
- `withdrawal_id`: ID unik untuk penarikan (String)
- `amount`: Jumlah uang yang ditarik (Number)
- `date`: Tanggal penarikan (Format: YYYY-MM-DD)
- `status`: Status penarikan (completed/pending/failed)

---

## Data Saldo (Balance)

**Nama file**: `data_balance.csv`

**Format CSV** (Header wajib sesuai persis):
```csv
date,balance_amount,currency
2024-01-18,5000000,IDR
2024-01-17,4500000,IDR
2024-01-16,4200000,IDR
```

**Field Requirements**:
- `date`: Tanggal saldo (Format: YYYY-MM-DD)
- `balance_amount`: Jumlah saldo (Number)
- `currency`: Mata uang (e.g., IDR, USD)

---

## Petunjuk Penggunaan

### 1. Persiapan File CSV

- Gunakan aplikasi seperti Excel, Google Sheets, atau text editor
- Pastikan header row ada dan sesuai dengan format di atas
- Simpan dengan format **CSV** (bukan XLSX)
  - Di Excel: File > Save As > Format "CSV (Comma Delimited)"
  - Di Google Sheets: File > Download > CSV

### 2. Isi Aplikasi

1. Pilih **Platform**: Shopee, TikTok, atau Lazada
2. Pilih **Brand**: Tergantung platform yang dipilih
3. Pilih **Cabang**: Tergantung brand yang dipilih
4. Pilih **Jenis Data**: Order, Penarikan, atau Saldo
5. Upload file CSV

### 3. Validasi

Aplikasi akan otomatis validasi:
- ✅ Format CSV benar
- ✅ Header sesuai dengan jenis data
- ✅ Data tidak kosong
- ✅ Struktur kolom benar

---

## Common Errors & Solutions

### "CSV file harus memiliki minimal header dan 1 data row"
- **Penyebab**: File CSV kosong atau hanya ada header
- **Solusi**: Tambahkan minimal 1 baris data

### "Row X memiliki jumlah kolom yang tidak sesuai dengan header"
- **Penyebab**: Jumlah kolom tidak sama di semua baris
- **Solusi**: Pastikan setiap baris memiliki jumlah kolom yang sama dengan header

### "Field 'order_id' tidak ditemukan di CSV"
- **Penyebab**: Header tidak sesuai dengan format yang diharapkan
- **Solusi**: 
  - Untuk Data Order, pastikan header: `order_id,product,quantity,price,date`
  - Perhatian: Case-sensitive dan tanpa spasi tambahan

### "N8N webhook failed"
- **Penyebab**: Webhook URL tidak valid atau n8n sedang offline
- **Solusi**: 
  1. Pastikan URL webhook sudah benar di `.env.local`
  2. Test webhook dari n8n dashboard
  3. Pastikan firewall tidak memblokir koneksi

---

## Tips

1. **Backup data**: Simpan copy original file sebelum import
2. **Test kecil dulu**: Coba dengan data sample sebelum import data besar
3. **Monitor workflow**: Cek n8n dashboard untuk memastikan data diterima
4. **Error handling**: Perhatikan pesan error untuk debugging lebih lanjut

---

## Support

Jika ada masalah:
1. Lihat error message di aplikasi
2. Cek format CSV sesuai dokumentasi ini
3. Verifikasi platform, brand, dan cabang sudah dipilih dengan benar
4. Lihat logs server untuk informasi lebih detail
