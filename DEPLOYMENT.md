# Sales Import Application - Deployment Guide

## 📋 Daftar Isi
1. [Setup Lokal](#setup-lokal)
2. [Deployment ke Vercel](#deployment-ke-vercel)
3. [Deployment ke Server Pribadi](#deployment-ke-server-pribadi)
4. [Konfigurasi n8n](#konfigurasi-n8n)
5. [Struktur Proyek](#struktur-proyek)

---

## Setup Lokal

### Prerequisites
- Node.js 16+ (https://nodejs.org/)
- npm atau yarn

### Langkah-langkah

1. **Clone atau download proyek**
   ```bash
   cd Import\ Apps
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Buat file `.env.local`**
   ```bash
   cp .env.example .env.local
   ```

4. **Konfigurasi environment variables di `.env.local`**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-path
   ```

5. **Jalankan development server**
   ```bash
   npm run dev
   ```

6. **Buka browser**
   - Kunjungi http://localhost:3000

---

## Deployment ke Vercel

### Langkah-langkah

1. **Push ke GitHub**
   - Buat repository baru di GitHub
   - Push kode ke repository

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/repository.git
   git push -u origin main
   ```

2. **Setup di Vercel**
   - Buka https://vercel.com/
   - Login dengan akun GitHub
   - Klik "New Project"
   - Pilih repository yang baru saja dibuat
   - Klik "Import"

3. **Konfigurasi Environment Variables**
   - Di halaman project settings Vercel
   - Buka tab "Environment Variables"
   - Tambahkan:
     ```
     NEXT_PUBLIC_API_URL = https://your-deployment-url.vercel.app
     N8N_WEBHOOK_URL = https://your-n8n-instance.com/webhook/your-webhook-path
     ```

4. **Deploy**
   - Klik "Deploy"
   - Tunggu hingga deployment selesai
   - Akses aplikasi dari URL yang diberikan Vercel

**Tips**: 
- Vercel akan otomatis deploy setiap ada push ke branch `main`
- Preview deployments dibuat untuk setiap pull request

---

## Deployment ke Server Pribadi

### Prerequisites
- Server dengan OS Linux (Ubuntu 20.04+)
- Node.js 16+ terinstall
- npm atau yarn
- PM2 untuk production process management
- Nginx atau Apache (opsional, untuk reverse proxy)

### Langkah-langkah

#### 1. Setup Server

```bash
# Login ke server
ssh user@your-server-ip

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js (jika belum)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Setup folder aplikasi
mkdir -p /var/www/sales-import-app
cd /var/www/sales-import-app
```

#### 2. Clone atau Upload Proyek

**Opsi A: Dari Git**
```bash
git clone https://github.com/username/repository.git .
```

**Opsi B: Upload via SCP**
```bash
# Dari lokal machine
scp -r ./* user@your-server-ip:/var/www/sales-import-app/
```

#### 3. Install Dependencies dan Build

```bash
cd /var/www/sales-import-app
npm install
npm run build
```

#### 4. Setup Environment Variables

```bash
# Buat file .env.local
nano .env.local
```

Tambahkan:
```
NEXT_PUBLIC_API_URL=https://your-domain.com
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-path
NODE_ENV=production
```

Tekan `Ctrl+X`, lalu `Y`, lalu `Enter` untuk save.

#### 5. Start dengan PM2

```bash
# Start aplikasi
pm2 start npm --name "sales-import-app" -- start

# Verify aplikasi berjalan
pm2 status

# Setup PM2 untuk auto-start saat boot
pm2 startup
pm2 save

# Lihat logs (opsional)
pm2 logs sales-import-app
```

#### 6. Setup Nginx Reverse Proxy (Recommended)

```bash
# Install Nginx
sudo apt install -y nginx

# Buat konfigurasi Nginx
sudo nano /etc/nginx/sites-available/sales-import-app
```

Tambahkan konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP ke HTTPS (opsional, jika menggunakan SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable konfigurasi
sudo ln -s /etc/nginx/sites-available/sales-import-app /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 7. Setup SSL Certificate (Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renew certificate
sudo certbot renew --dry-run
```

#### 8. Update dan Maintenance

**Update aplikasi:**
```bash
cd /var/www/sales-import-app

# Pull latest code
git pull origin main

# Install dependencies jika ada perubahan
npm install

# Build ulang
npm run build

# Restart aplikasi dengan PM2
pm2 restart sales-import-app
```

---

## Konfigurasi n8n

### 1. Setup n8n Webhook

1. Login ke n8n dashboard
2. Buat workflow baru
3. Tambahkan "Webhook" trigger node
4. Konfigurasi:
   - Method: `POST`
   - Authentication: Opsional (bisa ditambahkan nanti)
5. Salin webhook URL

### 2. Contoh n8n Workflow

Setelah trigger webhook, Anda dapat:
- **Parse data**: Extract fields dari payload CSV
- **Transform**: Ubah format data sesuai kebutuhan
- **Validate**: Validasi data sebelum proses
- **Save**: Simpan ke database (PostgreSQL, MySQL, dll)
- **Notify**: Kirim notifikasi email/Slack
- **Custom Logic**: Tambahkan business logic sesuai kebutuhan

---

## Struktur Proyek

```
Import Apps/
├── pages/
│   ├── _app.tsx              # Next.js App wrapper
│   ├── _document.tsx         # HTML document structure
│   ├── index.tsx             # Home page
│   └── api/
│       └── import.ts         # API endpoint untuk import
├── components/
│   └── ImportForm.tsx        # Form component utama
├── lib/
│   ├── brandBranchData.ts    # Data platform, brand, cabang
│   └── csvParser.ts          # CSV parsing dan validation
├── styles/
│   ├── globals.css           # Global styles
│   └── Form.module.css       # Form component styles
├── public/                   # Static files
├── .env.example              # Environment variables example
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── README.md                 # Dokumentasi (file ini)
```

---

## Troubleshooting

### Masalah: Port 3000 sudah digunakan

**Solusi:**
```bash
# Development
npm run dev -- -p 3001

# Production (dengan PM2)
pm2 start npm --name "sales-import-app" -- start -- -p 3001
```

### Masalah: N8N Webhook tidak menerima data

**Debugging:**
1. Cek webhook URL di `.env.local`
2. Pastikan n8n instance dapat diakses dari server
3. Cek firewall rules
4. Lihat logs: `pm2 logs sales-import-app`

### Masalah: CSV file upload error

1. Pastikan file adalah CSV format
2. Check ukuran file (max 50MB)
3. Verifikasi struktur CSV sesuai dokumentasi
4. Lihat error message di browser console

### Masalah: Memory leak atau crash

```bash
# Monitor penggunaan memory
pm2 monit

# Restart aplikasi
pm2 restart sales-import-app

# Lihat error details
pm2 logs sales-import-app --lines 100
```

---

## Performance Tips

1. **Optimize CSV parsing** untuk file besar
2. **Add pagination** jika data sangat banyak
3. **Use CDN** untuk static files
4. **Enable compression** di Nginx
5. **Monitor** penggunaan resources dengan PM2

---

## Security Considerations

1. **Environment Variables**: Jangan commit `.env.local`
2. **File Upload**: Validate file type dan size
3. **CORS**: Configure dengan baik
4. **Rate Limiting**: Tambahkan rate limiter untuk API
5. **SSL/TLS**: Selalu gunakan HTTPS di production

---

## Support & Questions

Untuk pertanyaan atau masalah:
1. Cek dokumentasi Next.js: https://nextjs.org/docs
2. Cek dokumentasi n8n: https://docs.n8n.io
3. Buka issue di repository GitHub

---

**Last Updated:** January 2026
