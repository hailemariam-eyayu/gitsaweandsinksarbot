# 🚀 Deployment Guide

The Ethiopian Orthodox Telegram Bot can be deployed to multiple platforms. Choose the one that works best for you:

## 🔥 **Vercel (Recommended for Serverless)**

### Quick Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hailemariam-eyayu/gitsaweandsinksarbot)

### Manual Deployment
1. **Fork/Clone the repository**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Set Environment Variables:**
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

4. **Deploy and Setup Webhook:**
   ```bash
   # After deployment, set your webhook URL
   WEBHOOK_URL=https://your-app.vercel.app npm run webhook
   ```

---

## 🚂 **Railway**

### Quick Deploy Button
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

### Manual Deployment
1. **Connect GitHub repository to Railway**
2. **Set environment variables:**
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```
3. **Deploy automatically**

---

## 🎨 **Render**

### Quick Deploy Button
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Manual Deployment
1. **Connect your GitHub repository**
2. **Choose "Web Service"**
3. **Set environment variables:**
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```
4. **Deploy**

---

## 💜 **Heroku**

### Quick Deploy Button
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/hailemariam-eyayu/gitsaweandsinksarbot)

### Manual Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-bot-name

# Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_bot_token_here

# Deploy
git push heroku main

# Scale worker
heroku ps:scale worker=1
```

---

## 🔄 **Replit**

1. **Import from GitHub:**
   - Go to [replit.com](https://replit.com)
   - Click "Import from GitHub"
   - Enter: `https://github.com/hailemariam-eyayu/gitsaweandsinksarbot`

2. **Set Environment Variables:**
   - Go to "Secrets" tab
   - Add: `TELEGRAM_BOT_TOKEN` = your_bot_token_here

3. **Run the bot:**
   - Click "Run" button

---

## 🔧 **Environment Variables**

All platforms need this environment variable:

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | ✅ Yes |

### Getting Your Bot Token
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot`
3. Follow the instructions
4. Copy the token

---

## 🎯 **Platform Comparison**

| Platform | Type | Cost | Pros | Cons |
|----------|------|------|------|------|
| **Vercel** | Serverless | Free tier | Fast, reliable, webhook-based | No long-running processes |
| **Railway** | Container | Free tier | Easy setup, persistent storage | Limited free hours |
| **Render** | Web Service | Free tier | Simple deployment | Sleep on inactivity |
| **Heroku** | Dyno | Paid | Reliable, well-documented | No free tier |
| **Replit** | Cloud IDE | Free tier | Easy to use, built-in editor | Public by default |

---

## 🔍 **Testing Your Deployment**

After deployment, test your bot:

1. **Find your bot on Telegram**
2. **Send `/start`** - Should get welcome message
3. **Send `/today`** - Should get today's readings
4. **Send `/help`** - Should get help message

---

## 🐛 **Troubleshooting**

### Bot not responding?
- ✅ Check environment variables are set
- ✅ Verify bot token is correct
- ✅ Check deployment logs
- ✅ For Vercel: Ensure webhook is set up

### Webhook issues (Vercel)?
```bash
# Check webhook status
curl https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo

# Reset webhook
npm run webhook
```

### Long messages not working?
- ✅ Check message splitting is working
- ✅ Verify content cleaning functions
- ✅ Check Telegram API limits

---

## 📞 **Support**

If you need help:
1. Check the logs in your deployment platform
2. Verify environment variables
3. Test bot token with Telegram API
4. Check GitHub issues for similar problems

Happy deploying! 🎉