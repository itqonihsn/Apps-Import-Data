# 🚀 Panduan Deploy ke Vercel - Step by Step

## 📋 Persiapan Sebelum Deploy

### 1. Pastikan Proyek Siap
✅ Semua file sudah di-commit ke Git  
✅ Dependencies sudah terinstall (`npm install`)  
✅ Build berhasil (`npm run build` - opsional, untuk test)

---

## 🎯 Langkah-langkah Deploy ke Vercel

### **STEP 1: Buat Repository GitHub** (jika belum ada)

1. Buka https://github.com dan login
2. Klik tombol **"New"** atau **"+"** → **"New repository"**
3. Isi informasi:
   - **Repository name**: `sales-import-app` (atau nama lain)
   - **Description**: Sales Import Application
   - **Visibility**: Public atau Private (sesuai kebutuhan)
   - **JANGAN** centang "Initialize with README" (karena sudah ada file)
4. Klik **"Create repository"**

---

### **STEP 2: Push Kode ke GitHub**

Buka terminal/command prompt di folder proyek Anda dan jalankan:

```bash
# Inisialisasi Git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit perubahan
git commit -m "Initial commit - Ready for Vercel deployment"

# Tambahkan remote repository (ganti dengan URL repository Anda)
git remote add origin https://github.com/USERNAME/REPOSITORY-NAME.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

**Catatan**: Ganti `USERNAME` dan `REPOSITORY-NAME` dengan username GitHub dan nama repository Anda.

---

### **STEP 3: Login ke Vercel**

1. Buka https://vercel.com
2. Klik **"Sign Up"** atau **"Log In"**
3. Pilih **"Continue with GitHub"** (disarankan untuk integrasi mudah)
4. Authorize Vercel untuk mengakses GitHub Anda

---

### **STEP 4: Import Project ke Vercel**

1. Setelah login, klik tombol **"Add New..."** → **"Project"**
2. Di halaman "Import Git Repository":
   - Pilih repository yang baru saja dibuat (`sales-import-app`)
   - Klik **"Import"**

---

### **STEP 5: Konfigurasi Project**

Di halaman "Configure Project":

1. **Project Name**: Biarkan default atau ubah sesuai keinginan
2. **Framework Preset**: Vercel akan auto-detect **Next.js** ✅
3. **Root Directory**: Biarkan kosong (default: `./`)
4. **Build Command**: `next build` (sudah otomatis)
5. **Output Directory**: `.next` (sudah otomatis)
6. **Install Command**: `npm install` (sudah otomatis)

**Jangan klik Deploy dulu!** Kita perlu set Environment Variables terlebih dahulu.

---

### **STEP 6: Setup Environment Variables**

1. Di halaman konfigurasi, scroll ke bawah ke bagian **"Environment Variables"**
2. Klik **"Add"** untuk setiap variable berikut:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-project-name.vercel.app` 
     *(Kosongkan dulu, kita akan update setelah deploy pertama)*
   - **Environment**: Pilih semua (Production, Preview, Development)
   - Klik **"Add"**

   **Variable 2:**
   - **Name**: `N8N_WEBHOOK_URL`
   - **Value**: `https://your-n8n-instance.com/webhook/your-webhook-path`
     *(Ganti dengan URL webhook n8n Anda yang sebenarnya)*
   - **Environment**: Pilih semua (Production, Preview, Development)
   - Klik **"Add"**

3. Setelah semua variable ditambahkan, klik **"Deploy"**

---

### **STEP 7: Tunggu Deployment Selesai**

1. Vercel akan mulai build project Anda
2. Anda bisa melihat progress di halaman deployment
3. Proses biasanya memakan waktu **2-5 menit**
4. Setelah selesai, Anda akan melihat:
   - ✅ **"Ready"** status
   - URL aplikasi: `https://your-project-name.vercel.app`

---

### **STEP 8: Update NEXT_PUBLIC_API_URL**

Setelah deployment pertama selesai:

1. Salin URL deployment Anda (contoh: `https://sales-import-app.vercel.app`)
2. Buka **Project Settings** → **Environment Variables**
3. Edit variable `NEXT_PUBLIC_API_URL`
4. Update value dengan URL deployment Anda
5. Klik **"Save"**
6. **Redeploy** aplikasi:
   - Buka tab **"Deployments"**
   - Klik **"..."** pada deployment terbaru
   - Pilih **"Redeploy"**

---

## ✅ Verifikasi Deployment

1. Buka URL aplikasi Anda: `https://your-project-name.vercel.app`
2. Test fitur upload CSV
3. Cek console/logs jika ada error

---

## 🔄 Update Aplikasi (Setelah Perubahan Kode)

Setelah melakukan perubahan kode:

```bash
# Commit perubahan
git add .
git commit -m "Update: deskripsi perubahan"

# Push ke GitHub
git push origin main
```

**Vercel akan otomatis deploy ulang!** 🎉

- Setiap push ke branch `main` akan trigger deployment otomatis
- Setiap Pull Request akan membuat Preview Deployment

---

## 🛠️ Troubleshooting

### Masalah: Build Failed

**Solusi:**
1. Cek error message di Vercel dashboard
2. Pastikan semua dependencies ada di `package.json`
3. Test build lokal: `npm run build`
4. Pastikan tidak ada error TypeScript: `npm run lint`

### Masalah: Environment Variables tidak terbaca

**Solusi:**
1. Pastikan variable name benar (case-sensitive)
2. Pastikan sudah di-set untuk environment yang tepat
3. Redeploy setelah menambah/edit variable
4. Variable `NEXT_PUBLIC_*` harus di-rebuild (redeploy)

### Masalah: API Route tidak bekerja

**Solusi:**
1. Cek `NEXT_PUBLIC_API_URL` sudah benar
2. Pastikan URL menggunakan `https://` (bukan `http://`)
3. Cek logs di Vercel dashboard → Functions tab

### Masalah: File upload error

**Solusi:**
1. Cek ukuran file (Vercel limit: 4.5MB untuk serverless functions)
2. Pastikan `formidable` dan `form-data` sudah terinstall
3. Cek logs untuk detail error

---

## 📝 Checklist Deployment

- [ ] Repository GitHub sudah dibuat
- [ ] Kode sudah di-push ke GitHub
- [ ] Akun Vercel sudah dibuat dan login
- [ ] Project sudah di-import ke Vercel
- [ ] Environment Variables sudah di-set:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `N8N_WEBHOOK_URL`
- [ ] Deployment pertama sudah selesai
- [ ] `NEXT_PUBLIC_API_URL` sudah di-update dengan URL Vercel
- [ ] Aplikasi sudah di-test dan berfungsi

---

## 🎉 Selesai!

Setelah semua langkah di atas, aplikasi Anda sudah live di Vercel!

**URL Aplikasi**: `https://your-project-name.vercel.app`

---

## 💡 Tips Tambahan

1. **Custom Domain**: Bisa tambahkan custom domain di Project Settings → Domains
2. **Analytics**: Aktifkan Vercel Analytics untuk monitoring
3. **Preview Deployments**: Setiap PR akan dapat preview URL sendiri
4. **Environment Variables**: Bisa set berbeda untuk Production/Preview/Development

---

**Butuh bantuan?** Cek dokumentasi Vercel: https://vercel.com/docs
