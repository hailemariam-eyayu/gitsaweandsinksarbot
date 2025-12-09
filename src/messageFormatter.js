import { formatEthiopianDate, getEthiopianMonthName } from './ethiopianCalendar.js';

function formatGitsaweMessage(gitsawe, ethDate) {
  if (!gitsawe) return null;
  
  let message = `📖 *ግጽዌ - የዕለቱ ንባብ*\n`;
  message += `📅 ${formatEthiopianDate(ethDate)}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  if (gitsawe.title) {
    message += `*${gitsawe.title}*\n\n`;
  }
  
  if (gitsawe.content && Array.isArray(gitsawe.content)) {
    for (const section of gitsawe.content) {
      if (section.title) {
        message += `📌 *${section.title}*\n`;
      }
      if (section.main) {
        const truncatedMain = section.main.length > 800 
          ? section.main.substring(0, 800) + '...' 
          : section.main;
        message += `${truncatedMain}\n\n`;
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
    message += `*${sinksar.title}*\n\n`;
  }
  
  if (sinksar.content && Array.isArray(sinksar.content)) {
    for (const section of sinksar.content) {
      if (section.title) {
        message += `✝️ *${section.title}*\n`;
      }
      if (section.main) {
        const truncatedMain = section.main.length > 800 
          ? section.main.substring(0, 800) + '...' 
          : section.main;
        message += `${truncatedMain}\n\n`;
      }
    }
  }
  
  return message;
}

function formatDailyMessage(readings, ethDate) {
  const gregorianDate = new Date();
  const gregorianFormatted = gregorianDate.toLocaleDateString('en-GB');
  
  let header = `🙏 *የዕለቱ መንፈሳዊ ንባብ*\n`;
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

*ትዕዛዞች:*
/start - ለመመዝገብ
/today - የዛሬ ንባብ
/subscribe - ለዕለታዊ ንባብ ለመመዝገብ
/unsubscribe - ምዝገባን ለመሰረዝ
/help - እርዳታ

በየቀኑ ጠዋት የዕለቱ ንባብ ይላክልዎታል!`;
}

function formatHelpMessage() {
  return `📚 *የእርዳታ መረጃ*

*ስለ ቦቱ:*
ይህ ቦት የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን የዕለት ንባብ ያቀርባል።

*ግጽዌ:* የዕለቱ የመጽሐፍ ቅዱስ ንባብ
*ስንክሳር:* የቅዱሳን ታሪክ

*ትዕዛዞች:*
/start - ለመመዝገብ
/today - የዛሬ ንባብ ለማግኘት
/subscribe - ለዕለታዊ ንባብ ለመመዝገብ
/unsubscribe - ምዝገባን ለመሰረዝ
/status - የምዝገባ ሁኔታ

ጥያቄ ካለዎት ያነጋግሩን!`;
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
