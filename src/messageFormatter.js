import { formatEthiopianDate, getEthiopianMonthName } from './ethiopianCalendar.js';

function escapeMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/`/g, '\\`');
}

function formatGitsaweMessage(gitsawe, ethDate) {
  if (!gitsawe) return null;
  
  let message = `📖 *ግጽዌ - የዕለቱ ንባብ*\n`;
  message += `📅 ${formatEthiopianDate(ethDate)}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  if (gitsawe.title) {
    message += `*${escapeMarkdown(gitsawe.title)}*\n\n`;
  }
  
  if (gitsawe.content && Array.isArray(gitsawe.content)) {
    for (const section of gitsawe.content) {
      if (section.title) {
        message += `📌 *${escapeMarkdown(section.title)}*\n`;
      }
      if (section.main) {
        const truncatedMain = section.main.length > 800 
          ? section.main.substring(0, 800) + '...' 
          : section.main;
        message += `${escapeMarkdown(truncatedMain)}\n\n`;
      }
    }
  }
  
  return message;
}

function formatSinksarMessage(sinksar, ethDate) {
  if (!sinksar) return null;
  
  let message = `📜 *ስንክሳር - የቅዱሳን ታሪክ*\n`;
  message += `📅 ${formatEthiopianDate(ethDate)}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  if (sinksar.title) {
    message += `*${escapeMarkdown(sinksar.title)}*\n\n`;
  }
  
  if (sinksar.content && Array.isArray(sinksar.content)) {
    for (const section of sinksar.content) {
      if (section.title) {
        message += `✝️ *${escapeMarkdown(section.title)}*\n`;
      }
      if (section.main) {
        const truncatedMain = section.main.length > 800 
          ? section.main.substring(0, 800) + '...' 
          : section.main;
        message += `${escapeMarkdown(truncatedMain)}\n\n`;
      }
    }
  }
  
  return message;
}

function formatDailyMessage(readings, ethDate, dateLabel = 'የዛሬ') {
  const gregorianDate = new Date();
  const gregorianFormatted = gregorianDate.toLocaleDateString('en-GB');
  
  let header = `🙏 *${dateLabel} መንፈሳዊ ንባብ*\n`;
  header += `📅 ግሪጎሪያን: ${gregorianFormatted}\n`;
  header += `📅 ኢትዮጵያ: ${formatEthiopianDate(ethDate)}\n`;
  header += `════════════════════════\n\n`;
  
  const messages = [header];
  
  if (readings.gitsawe) {
    messages.push(formatGitsaweMessage(readings.gitsawe, ethDate));
  }
  
  if (readings.sinksar) {
    messages.push(formatSinksarMessage(readings.sinksar, ethDate));
  }
  
  if (!readings.found) {
    messages.push(`⚠️ ለዚህ ቀን ንባብ አልተገኘም።`);
  }
  
  return messages.filter(m => m !== null).join('\n');
}

function formatWelcomeMessage() {
  return `🙏 *እንኳን ደህና መጡ!*

ይህ ቦት የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን የዕለት ንባብ (ግጽዌ እና ስንክሳር) ያቀርባል።

✅ *አሁን ተመዝግበዋል!* በየቀኑ ጠዋት 6:00 ሰዓት የዕለቱ ንባብ ይላክልዎታል።

*📱 ዋና ትዕዛዞች:*
/today - የዛሬ ንባብ
/yesterday - የትናንት ንባብ
/tomorrow - የነገ ንባብ
/subscribe - ለዕለታዊ ንባብ ለመመዝገብ
/unsubscribe - ምዝገባን ለመሰረዝ
/status - የምዝገባ ሁኔታ
/help - ሙሉ እርዳታ

*📖 ግጽዌ:* የዕለቱ የመጽሐፍ ቅዱስ ንባብ
*📜 ስንክሳር:* የቅዱሳን ታሪክ እና ትዝታ

*⏰ የዕለታዊ ንባብ ጊዜ:*
በየቀኑ ጠዋት 6:00 ሰዓት (የኢትዮጵያ ሰዓት)

🕊️ ሰላም ይሁንላችሁ!`;
}

function formatHelpMessage() {
  return `📚 *የእርዳታ መረጃ*

*🤖 ስለ ቦቱ:*
ይህ ቦት የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን የዕለት ንባብ ያቀርባል።

*📖 ግጽዌ:* የዕለቱ የመጽሐፍ ቅዱስ ንባብ
*📜 ስንክሳር:* የቅዱሳን ታሪክ እና ትዝታ

*📱 ዋና ትዕዛዞች:*
/start - ለመመዝገብ እና ቦቱን ለመጀመር
/today - የዛሬ ንባብ ለማግኘት
/yesterday - የትናንት ንባብ ለማግኘት
/tomorrow - የነገ ንባብ ለማግኘት
/subscribe - ለዕለታዊ ንባብ ለመመዝገብ
/unsubscribe - ምዝገባን ለመሰረዝ
/status - የምዝገባ ሁኔታ ለማየት
/help - ይህን እርዳታ ለማየት

*⏰ የዕለታዊ ንባብ ጊዜ:*
በየቀኑ ጠዋት 6:00 ሰዓት (የኢትዮጵያ ሰዓት)

*👨‍💼 የአስተዳዳሪ ትዕዛዞች:*
/broadcast - ለሁሉም ተመዝጋቢዎች መላክ
/stats - የቦት ስታቲስቲክስ
/addchannel - ቻናል ለመጨመር
/removechannel - ቻናል ለማስወገድ

ጥያቄ ካለዎት ያነጋግሩን! 🕊️`;
}

function formatSubscriptionStatus(isSubscribed) {
  if (isSubscribed) {
    return `✅ *ተመዝግበዋል!*\n\nበየቀኑ ጠዋት የዕለቱ ንባብ ይላክልዎታል።`;
  } else {
    return `❌ *አልተመዘገቡም*\n\nለመመዝገብ /subscribe ይላኩ።`;
  }
}

export {
  formatGitsaweMessage,
  formatSinksarMessage,
  formatDailyMessage,
  formatWelcomeMessage,
  formatHelpMessage,
  formatSubscriptionStatus
};
