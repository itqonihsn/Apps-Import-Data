# Development Notes

## API Endpoint: /api/import

### Request
- **Method**: POST
- **Content-Type**: multipart/form-data

### Form Data Parameters
- `platform` (string): Shopee, TikTok, atau Lazada
- `brand` (string): Brand yang dipilih
- `branch` (string): Cabang yang dipilih
- `dataType` (string): order, withdrawal, atau balance
- `csvFile` (file): File CSV yang akan diimport

### Response Success (200)
```json
{
  "success": true,
  "recordCount": 10
}
```

### Response Error (400/500)
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Payload ke n8n

Setelah CSV berhasil diparse, data dikirim ke n8n dengan format:

```json
{
  "timestamp": "2024-01-18T10:30:00.000Z",
  "platform": "Shopee",
  "brand": "Brighty",
  "branch": "Brighty Official Shop",
  "dataType": "order",
  "recordCount": 10,
  "records": [
    {
      "order_id": "ORD001",
      "product": "Produk A",
      "quantity": "5",
      "price": "50000",
      "date": "2024-01-18"
    },
    ...
  ]
}
```

---

## Deployment Checklist

### Before Production
- [ ] Environment variables sudah dikonfigurasi
- [ ] N8N webhook URL sudah ditest dan berfungsi
- [ ] Database connection (jika ada) sudah setup
- [ ] SSL certificate sudah aktif
- [ ] PM2 ecosystem file sudah dibuat (opsional)
- [ ] Backup strategy sudah siap

### Monitoring
- [ ] Setup logs aggregation (PM2 Plus, DataDog, dll)
- [ ] Setup alerts untuk error
- [ ] Monitor memory dan CPU usage
- [ ] Check disk space regularly

### Security
- [ ] HTTPS sudah enabled
- [ ] Rate limiting sudah dikonfigurasi
- [ ] Environment variables sudah di-gitignore
- [ ] Input validation sudah diterapkan
- [ ] CORS sudah dikonfigurasi dengan benar

---

## Future Enhancements

1. **Authentication**
   - Add login system
   - JWT token validation
   - User management

2. **Features**
   - Bulk import untuk multiple files
   - Preview data sebelum import
   - Export historical data
   - Import scheduling
   - Data transformation pipeline

3. **Performance**
   - Implement pagination untuk large datasets
   - Add caching layer
   - Optimize CSV parsing untuk file besar
   - Add image/file optimization

4. **Reliability**
   - Add retry logic untuk n8n webhook
   - Add queue system (Bull, RabbitMQ)
   - Add transaction logging
   - Add audit trail

5. **UI/UX**
   - Add progress bar untuk upload
   - Add drag-and-drop file upload
   - Add data preview modal
   - Add import history
   - Dark mode support

6. **Analytics**
   - Track import statistics
   - Monitor webhook success rate
   - Generate reports

---

## Troubleshooting Guide

### Application won't start
```bash
# Check Node version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
lsof -i :3000
```

### Memory issues in production
```bash
# Check PM2 memory usage
pm2 monit

# Increase Node heap size
NODE_OPTIONS="--max-old-space-size=2048" pm2 start npm --name "app" -- start

# Kill and restart
pm2 kill
pm2 resurrect
```

### n8n webhook not responding
1. Test webhook manually: `curl -X POST https://your-webhook-url -H "Content-Type: application/json" -d '{"test": true}'`
2. Check n8n logs: `docker logs n8n` (if containerized)
3. Verify network connectivity from server to n8n instance
4. Check firewall rules

---

## Environment Variables Reference

```
# Public (safe to expose in browser)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Private (server-side only)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/path
NODE_ENV=development|production

# Optional advanced configs
LOG_LEVEL=info|debug|error
MAX_FILE_SIZE=52428800  # 50MB in bytes
CSV_CHUNK_SIZE=1000     # Process CSV in chunks
```

---

Last Updated: January 2026
