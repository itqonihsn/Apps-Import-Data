#!/bin/bash

# Script untuk setup GitHub Personal Access Token
# Usage: ./setup-github-token.sh

echo "🔐 GitHub Personal Access Token Setup"
echo "======================================"
echo ""
echo "Langkah 1: Buat Personal Access Token"
echo "1. Buka: https://github.com/settings/tokens"
echo "2. Klik 'Generate new token' -> 'Generate new token (classic)'"
echo "3. Beri nama: 'Apps-Import-Data-Push'"
echo "4. Pilih expiration (recommended: 90 days atau No expiration)"
echo "5. Centang scope: 'repo' (semua checkbox di bawah repo)"
echo "6. Klik 'Generate token'"
echo "7. COPY TOKEN (hanya muncul sekali!)"
echo ""
echo "Langkah 2: Masukkan token di bawah ini"
echo ""

read -sp "Masukkan Personal Access Token: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Token tidak boleh kosong!"
    exit 1
fi

echo ""
echo "🔧 Setting up git credential..."

# Setup credential helper untuk menyimpan token
git config --global credential.helper osxkeychain

# Test dengan push (akan menyimpan credential)
echo "🧪 Testing credential dengan push..."
echo ""

# Setup remote URL dengan token embedded (temporary untuk test)
GIT_URL="https://${GITHUB_TOKEN}@github.com/itqonihsn/Apps-Import-Data.git"

# Simpan credential ke keychain
echo "https://itqonihsn:${GITHUB_TOKEN}@github.com" | git credential approve

echo "✅ Credential sudah disimpan!"
echo ""
echo "🚀 Mencoba push ke GitHub..."

# Push dengan credential yang sudah disimpan
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅✅✅ BERHASIL! Push ke GitHub sukses!"
    echo "📦 Vercel akan otomatis redeploy dalam beberapa detik..."
    echo ""
    echo "Cek deployment di: https://vercel.com/dashboard"
else
    echo ""
    echo "❌ Push gagal. Coba manual dengan:"
    echo "   git push origin main"
    echo ""
    echo "Atau setup credential manual:"
    echo "   git config --global credential.helper osxkeychain"
    exit 1
fi
