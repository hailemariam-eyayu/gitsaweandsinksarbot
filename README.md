# Ethiopian Orthodox Telegram Bot (Temp Repository)

A Telegram bot that provides daily Ethiopian Orthodox readings (Gitsawe and Sinksar) with automatic scheduling and user subscription management.

## 🚀 Quick Setup

### 1. Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### 2. Get Bot Token
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Create a new bot with `/newbot`
3. Copy the token to your `.env` file

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Bot
```bash
npm start
```

## 📋 Features

- ✅ **Daily Readings**: Gitsawe and Sinksar content
- ✅ **User Subscriptions**: Subscribe/unsubscribe functionality  
- ✅ **Scheduled Broadcasts**: Daily 6:00 AM Ethiopian time
- ✅ **Ethiopian Calendar**: Automatic date conversion
- ✅ **Message Splitting**: Handles long content properly
- ✅ **Error Handling**: Robust error management

## 🤖 Bot Commands

- `/start` - Welcome message and subscription
- `/today` - Get today's readings
- `/yesterday` - Get yesterday's readings  
- `/tomorrow` - Get tomorrow's readings
- `/subscribe` - Subscribe to daily readings
- `/unsubscribe` - Unsubscribe from daily readings
- `/help` - Show help message
- `/broadcast` - Manual broadcast (admin only)

## 📁 Project Structure

```
temp-bot-repo/
├── src/
│   ├── index.js              # Main bot logic
│   ├── messageFormatter.js   # Message formatting
│   ├── dataReader.js         # Data loading
│   ├── ethiopianCalendar.js  # Calendar functions
│   └── storage.js            # User storage
├── data/                     # JSON data files
├── attached_assets/          # Additional assets
└── package.json             # Dependencies
```

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ | Bot token from @BotFather |

## 📅 Scheduled Broadcasting

The bot automatically sends daily readings at **6:00 AM Ethiopian time** to all subscribed users.

## 🛠️ Development

### Testing
```bash
# Test deployment readiness
node test-deployment-ready.js

# Test scheduled broadcast
node test-scheduled-broadcast.js

# Test bot locally
node test-bot-locally.js
```

### Data Format
The bot reads from JSON files in the `data/` directory with Ethiopian Orthodox content structured by month and day.

## 🚀 Deployment

This bot is designed to run on platforms like:
- Replit
- Heroku  
- Railway
- VPS servers

Make sure to set the `TELEGRAM_BOT_TOKEN` environment variable in your deployment platform.

## 📝 License

This project is for Ethiopian Orthodox community use.