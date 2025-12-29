const ETHIOPIAN_MONTHS = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas',
  'Tir', 'Yekatit', 'Megabit', 'Miazia',
  'Ginbot', 'Sene', 'Hamle', 'Nehasse', 'Pagume'
];

const ETHIOPIAN_MONTHS_AMHARIC = [
  'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ',
  'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ',
  'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
];

function isGregorianLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function isEthiopianLeapYear(year) {
  return (year + 1) % 4 === 0;
}

function gregorianToEthiopian(gYear, gMonth, gDay) {
  const jdn = gregorianToJDN(gYear, gMonth, gDay);
  return jdnToEthiopian(jdn);
}

function gregorianToJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + 
         Math.floor(y / 400) - 32045;
}

function jdnToEthiopian(jdn) {
  const ethiopianEpoch = 1724221;
  const r = (jdn - ethiopianEpoch) % 1461;
  const n = r % 365 + 365 * Math.floor(r / 1460);
  
  const year = 4 * Math.floor((jdn - ethiopianEpoch) / 1461) + 
               Math.floor(r / 365) - Math.floor(r / 1460) + 1;
  
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  
  return { year, month, day };
}

function ethiopianToGregorian(eYear, eMonth, eDay) {
  const jdn = ethiopianToJDN(eYear, eMonth, eDay);
  return jdnToGregorian(jdn);
}

function ethiopianToJDN(year, month, day) {
  const ethiopianEpoch = 1724221;
  return ethiopianEpoch + 365 * year + Math.floor(year / 4) + 
         30 * (month - 1) + day - 1;
}

function jdnToGregorian(jdn) {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor(146097 * b / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  
  return { year, month, day };
}

function getEthiopianMonthName(monthNumber, amharic = false) {
  if (monthNumber < 1 || monthNumber > 13) {
    return null;
  }
  return amharic ? ETHIOPIAN_MONTHS_AMHARIC[monthNumber - 1] : ETHIOPIAN_MONTHS[monthNumber - 1];
}

function getTodayEthiopian() {
  const now = new Date();
  return gregorianToEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function getYesterdayEthiopian() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return gregorianToEthiopian(yesterday.getFullYear(), yesterday.getMonth() + 1, yesterday.getDate());
}

function getTomorrowEthiopian() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return gregorianToEthiopian(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate());
}

function formatEthiopianDate(ethDate) {
  const monthName = getEthiopianMonthName(ethDate.month, true);
  return `${monthName} ${ethDate.day}፣ ${ethDate.year} ዓ.ም.`;
}

export {
  ETHIOPIAN_MONTHS,
  ETHIOPIAN_MONTHS_AMHARIC,
  gregorianToEthiopian,
  ethiopianToGregorian,
  getEthiopianMonthName,
  getTodayEthiopian,
  formatEthiopianDate
};
