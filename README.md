# Sales Import App - README

Aplikasi modern untuk import data penjualan dari platform e-commerce (Shopee, TikTok, Lazada) dengan integrasi n8n webhook.

## 🚀 Fitur Utama

- ✅ Form dinamis dengan cascading dropdowns (Platform → Brand → Cabang)
- ✅ Import CSV untuk 3 jenis data (Order, Penarikan, Saldo)
- ✅ Validasi struktur CSV otomatis
- ✅ Integrasi n8n webhook untuk proses data real-time
- ✅ Responsive design modern
- ✅ Deployment siap Vercel & server pribadi

## 📋 Prerequisites

- Node.js 16+ ([download](https://nodejs.org/))
- npm atau yarn
- Akun n8n atau self-hosted n8n instance
- (Opsional) Git untuk version control

## 🛠️ Setup Lokal

```bash
# 1. Clone atau extract project
cd "Import Apps"

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local

# 4. Konfigurasi N8N webhook URL di .env.local
# Edit file dan ubah:
# N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/path

# 5. Run development server
npm run dev

# 6. Buka browser
# Kunjungi http://localhost:3000
```

## 📚 Dokumentasi

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Setup production, Vercel, server pribadi
- **[CSV_FORMAT.md](CSV_FORMAT.md)** - Format file CSV untuk setiap jenis data
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Technical details, API, troubleshooting

## 🏗️ Struktur Proyek

```
Import Apps/
├── pages/                    # Next.js pages & API routes
├── components/               # React components
├── lib/                      # Utilities (CSV parser, data config)
├── styles/                   # CSS modules
├── public/                   # Static files
├── .env.example              # Environment template
├── DEPLOYMENT.md             # Panduan deployment
├── CSV_FORMAT.md             # Format CSV documentation
└── DEVELOPMENT.md            # Development guide
```

## 🎨 Kombinasi Platform, Brand, dan Cabang

### Lazada
- **Brighty**: Brighty Official Store
- **Ciara**: Ciara Official Store

### Shopee
- **Brighty**: 11 cabang (Official Shop, Official Store, Jakarta Selatan, dll)
- **Ciara**: 7 cabang (Indonesia, Beauty, Jawa Tengah, dll)
- **Harnisch**: Harnisch
- **Herbikids**: Herbikids
- **Herbiglow**: Herbiglow
- **Jiera**: Jiera Official

### TikTok
- **Brighty**: Brighty.id
- **Ciara**: Ciara Indonesia
- **Harnisch**: Harnisch
- **Herbikids**: Herbikids
- **Herbiglow**: Herbiglow
- **Jiera**: Jiera

## 📤 CSV Import Format

Aplikasi menerima 3 jenis data CSV. Contoh untuk Order:

```csv
order_id,product,quantity,price,date
ORD001,Produk A,5,50000,2024-01-18
ORD002,Produk B,2,75000,2024-01-18
```

**Lihat [CSV_FORMAT.md](CSV_FORMAT.md) untuk format lengkap setiap jenis data.**

## 🔌 n8n Integration

Data CSV otomatis dikirim ke n8n webhook dengan format:

```json
{
  "timestamp": "2024-01-18T10:30:00Z",
  "platform": "Shopee",
  "brand": "Brighty",
  "branch": "Brighty Official Shop",
  "dataType": "order",
  "recordCount": 10,
  "records": [
    { "order_id": "ORD001", "product": "Produk A", ... }
  ]
}
```

## 🚢 Deployment

### Quick Deploy ke Vercel
1. Push code ke GitHub
2. Connect di https://vercel.com/
3. Add environment variables
4. Deploy otomatis!

### Deploy ke Server Pribadi
```bash
# Server setup
sudo apt install -y nodejs npm
sudo npm install -g pm2

# Clone dan setup
git clone <repo>
cd Import\ Apps
npm install && npm run build

# Run dengan PM2
pm2 start npm --name "sales-import" -- start
```

**Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk detail lengkap.**

## ⚙️ Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/path
NODE_ENV=development
```

## 🐛 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Port 3000 sudah dipakai | `npm run dev -- -p 3001` |
| Module not found | `npm install` |
| CSV validation error | Lihat [CSV_FORMAT.md](CSV_FORMAT.md) |
| N8N webhook error | Verifikasi webhook URL & akses n8n |

## 📞 Support

- Cek dokumentasi di folder root (DEPLOYMENT.md, CSV_FORMAT.md)
- Lihat error messages di browser console
- Check PM2 logs: `pm2 logs`

## 📦 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Styling**: CSS Modules
- **File Upload**: Formidable
- **CSV Parsing**: Custom parser + PapaParse
- **Hosting**: Vercel / Self-hosted Node.js

## 📄 Lisensi

MIT License - Bebas digunakan

---

**Version 1.0.0** | Updated January 2026
