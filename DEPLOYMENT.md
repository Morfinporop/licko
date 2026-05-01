# Deployment Guide — BioLink

This guide covers deploying BioLink to Railway.

## Prerequisites

- GitHub account
- Railway account ([railway.app](https://railway.app))
- Your code pushed to a GitHub repository

## Quick Deploy to Railway

### Option 1: One-Click Deploy (Recommended)

1. **Push your code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - BioLink app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/biolink.git
git push -u origin main
```

2. **Deploy on Railway**
   - Visit [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `biolink` repository
   - Railway will automatically detect Node.js and start building

3. **Set Environment Variables**

In Railway dashboard, go to your project → Variables tab and add:

```env
NODE_ENV=production
JWT_SECRET=YOUR_SECURE_RANDOM_SECRET_HERE
```

To generate a secure JWT secret, run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as `JWT_SECRET`.

**Optional variables:**
```env
ALLOWED_ORIGINS=https://your-domain.up.railway.app
PORT=8080
```

4. **Wait for deployment**
   - Railway will build and deploy your app
   - This takes 2-5 minutes
   - You'll get a URL like `https://your-app.up.railway.app`

5. **Done!** 🎉
   - Visit your Railway URL
   - Register an account
   - Create your first bio page

## Custom Domain

To use a custom domain like `deleteai.up.railway.app`:

1. Go to your Railway project
2. Click on "Settings" tab
3. Scroll to "Domains"
4. Click "Generate Domain" to get a Railway domain
5. Or add your custom domain and follow DNS setup instructions

## Database & Storage

BioLink uses SQLite with Better-SQLite3:
- Database file: `./data/biolink.db`
- Uploaded files: `./data/uploads/`

Railway provides persistent storage that survives deployments.

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Set to `production` |
| `PORT` | No | `8080` | Port to listen on (Railway auto-assigns) |
| `JWT_SECRET` | **Yes** | - | Secret for JWT tokens (use strong random string) |
| `ALLOWED_ORIGINS` | No | `*` | CORS origins (comma-separated URLs) |
| `DATA_DIR` | No | `./data` | Directory for database |
| `UPLOADS_DIR` | No | `./data/uploads` | Directory for uploaded files |

## Health Check

After deployment, verify your app is running:

```bash
curl https://your-app.up.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ",
  "service": "BioLink"
}
```

## Monitoring

Railway provides:
- Real-time logs (click "Deployments" → "View Logs")
- Metrics (CPU, Memory, Network)
- Deployment history

## Troubleshooting

### Build Fails

**Error**: `Cannot find module`
- Check `package.json` dependencies
- Run `npm install` locally to verify

**Error**: `EACCES: permission denied`
- Railway has proper permissions by default
- Check file paths use relative paths

### App Crashes on Start

**Check logs in Railway dashboard**

Common issues:
1. **Missing `JWT_SECRET`** - Add it in environment variables
2. **Port conflict** - Railway assigns PORT automatically, don't hardcode
3. **Database errors** - Data directory might not exist (created automatically on first run)

### Database Reset

To reset database:
1. In Railway dashboard, go to your service
2. Click "Data" tab
3. Delete `data/` volume (if needed)
4. Redeploy

### CORS Errors

Add your domain to `ALLOWED_ORIGINS`:
```env
ALLOWED_ORIGINS=https://deleteai.up.railway.app,https://www.yourdomain.com
```

## Updates & Redeployment

To update your app:

1. Make changes locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Update: description of changes"
git push
```

3. Railway automatically redeploys on push to main branch

## Scaling

For higher traffic:
1. In Railway dashboard, go to Settings
2. Adjust instance size if needed
3. Railway auto-scales within your plan limits

## Backup

**Database backup:**
```bash
# Download from Railway CLI
railway run cp data/biolink.db biolink-backup-$(date +%Y%m%d).db
```

**Automated backups:**
Railway Pro plan includes automatic backups.

## Security Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` with your actual domain
- [ ] Enable HTTPS (Railway does this automatically)
- [ ] Review rate limits in `server/index.js`
- [ ] Test authentication flow
- [ ] Test file uploads

## Cost Estimate

Railway pricing (as of 2024):
- **Free tier**: $0/month - 500 hours, good for testing
- **Pro tier**: $20/month - Unlimited usage, backups, priority support

SQLite keeps costs minimal (no separate database service needed).

## Support

- Railway docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Project issues: GitHub Issues on your repo

---

## Alternative: Deploy to Other Platforms

### Vercel (not recommended for this stack)
Vercel is serverless - Better-SQLite3 won't work. Use PostgreSQL instead.

### Heroku
Similar to Railway but requires separate database addon.

### VPS (DigitalOcean, Linode, etc.)

1. SSH into your server
2. Install Node.js 22:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Clone and setup:
```bash
git clone https://github.com/YOUR_USERNAME/biolink.git
cd biolink
npm install
npm run build
```

4. Create `.env` file with environment variables

5. Use PM2 to run:
```bash
npm install -g pm2
pm2 start npm --name biolink -- start
pm2 save
pm2 startup
```

6. Setup nginx reverse proxy (optional but recommended)

---

**Need help?** Check the main README.md or open an issue on GitHub.
