# Ethiopian Orthodox Daily Readings Telegram Bot

## Overview
A Telegram bot that sends daily Ethiopian Orthodox Church readings (Gitsawe and Sinksar) based on the Ethiopian calendar. The bot automatically converts Gregorian dates to Ethiopian calendar and fetches the corresponding readings.

## Project Structure
```
├── src/
│   ├── index.js              # Main bot entry point
│   ├── ethiopianCalendar.js  # Ethiopian calendar conversion utilities
│   ├── dataReader.js         # JSON data reading for Gitsawe and Sinksar
│   ├── messageFormatter.js   # Message formatting for Telegram
│   └── storage.js            # User/channel subscription storage
├── data/
│   ├── Gitsawe.json          # Daily readings data
│   ├── Sinksar.json          # Saints' history data
│   └── subscribers.json      # User subscriptions (auto-generated)
└── package.json
```

## Features
- **Ethiopian Calendar Conversion**: Converts Gregorian dates to Ethiopian calendar
- **Daily Readings**: Fetches Gitsawe (scripture readings) and Sinksar (saints' stories)
- **User Subscriptions**: Users can subscribe/unsubscribe for daily readings
- **Channel Support**: Can broadcast to Telegram channels
- **Scheduled Broadcasts**: Automatically sends readings at 6:00 AM Addis Ababa time

## Bot Commands
- `/start` - Register and get welcome message
- `/today` - Get today's readings
- `/subscribe` - Subscribe for daily readings
- `/unsubscribe` - Unsubscribe from daily readings
- `/status` - Check subscription status
- `/stats` - View statistics (admin)
- `/addchannel <id>` - Add a channel for broadcasts
- `/removechannel <id>` - Remove a channel
- `/broadcast` - Manually trigger broadcast to all subscribers

## Environment Variables
- `TELEGRAM_BOT_TOKEN` - Required: Telegram Bot API token from @BotFather

## Running the Bot
```bash
npm start
```

## Ethiopian Calendar Info
- Ethiopian year is ~7-8 years behind Gregorian
- 13 months: 12 months of 30 days + Pagume (5-6 days)
- Example: December 9, 2025 (Gregorian) = Tahsas 30, 2018 (Ethiopian)
