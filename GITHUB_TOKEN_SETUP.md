# Setup GitHub Personal Access Token

## Cara Membuat Personal Access Token

1. **Buka halaman GitHub Settings**
   - Link: https://github.com/settings/tokens
   - Atau: GitHub Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**
   - Klik **"Generate new token"** → **"Generate new token (classic)"**
   - Masukkan password GitHub jika diminta

3. **Konfigurasi Token**
   - **Note**: `Apps-Import-Data-Push` (atau nama lain)
   - **Expiration**: Pilih sesuai kebutuhan (90 days atau No expiration)
   - **Scopes**: Centang **`repo`** (semua checkbox di bawah repo)
     - ✅ repo (Full control of private repositories)
     - ✅ repo:status
     - ✅ repo_deployment
     - ✅ public_repo
     - ✅ repo:invite
     - ✅ security_events

4. **Generate dan Copy Token**
   - Klik **"Generate token"**
   - **PENTING**: Copy token sekarang! Token hanya muncul sekali.
   - Token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Setup Token di Git

### Opsi 1: Menggunakan Script Helper (Recommended)

```bash
./setup-github-token.sh
```

Script akan meminta token dan menyimpannya secara aman.

### Opsi 2: Manual Setup

#### A. Setup Credential Helper
```bash
git config --global credential.helper osxkeychain
```

#### B. Push dengan Token
```bash
git push origin main
```

Ketika diminta:
- **Username**: `itqonihsn` (atau username GitHub Anda)
- **Password**: Masukkan Personal Access Token (bukan password GitHub)

#### C. Atau Embed Token di URL (Temporary)
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/itqonihsn/Apps-Import-Data.git
git push origin main
```

**⚠️ PENTING**: Jangan commit file yang berisi token ke GitHub!

## Verifikasi

Setelah setup, coba push:
```bash
git push origin main
```

Jika berhasil, Vercel akan otomatis redeploy.

## Troubleshooting

### Token tidak bekerja
- Pastikan token memiliki scope `repo`
- Pastikan token belum expired
- Cek token di: https://github.com/settings/tokens

### Credential tidak tersimpan
```bash
# Clear credential cache
git credential-osxkeychain erase
host=github.com
protocol=https

# Setup ulang
git config --global credential.helper osxkeychain
```

### Masih diminta password
- Pastikan menggunakan token, bukan password GitHub
- Token format: `ghp_...` (40+ karakter)

## Security Notes

- ✅ Token disimpan di macOS Keychain (aman)
- ✅ Jangan share token ke siapa pun
- ✅ Jangan commit token ke repository
- ✅ Revoke token jika tidak digunakan lagi
- ✅ Gunakan token dengan scope minimal yang diperlukan
