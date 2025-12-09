import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ETHIOPIAN_MONTHS, getEthiopianMonthName } from './ethiopianCalendar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let gitsaweData = null;
let sinksarData = null;

function loadData() {
  try {
    const gitsawePath = path.join(__dirname, '../data/Gitsawe.json');
    const sinksarPath = path.join(__dirname, '../data/Sinksar.json');
    
    gitsaweData = JSON.parse(fs.readFileSync(gitsawePath, 'utf8'));
    sinksarData = JSON.parse(fs.readFileSync(sinksarPath, 'utf8'));
    
    console.log('Data files loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading data files:', error.message);
    return false;
  }
}

function getGitsaweForDay(monthNumber, dayId) {
  if (!gitsaweData) loadData();
  
  const monthName = getEthiopianMonthName(monthNumber, false);
  if (!monthName || !gitsaweData[monthName]) {
    return null;
  }
  
  const monthData = gitsaweData[monthName];
  const dayData = monthData.days.find(d => d.id === dayId);
  
  return dayData || null;
}

function getSinksarForDay(monthNumber, dayId) {
  if (!sinksarData) loadData();
  
  const monthName = getEthiopianMonthName(monthNumber, false);
  if (!monthName || !sinksarData[monthName]) {
    return null;
  }
  
  const monthData = sinksarData[monthName];
  const dayData = monthData.days.find(d => d.id === dayId);
  
  return dayData || null;
}

function getDailyReadings(monthNumber, dayId) {
  const gitsawe = getGitsaweForDay(monthNumber, dayId);
  const sinksar = getSinksarForDay(monthNumber, dayId);
  
  return {
    gitsawe,
    sinksar,
    found: !!(gitsawe || sinksar)
  };
}

export {
  loadData,
  getGitsaweForDay,
  getSinksarForDay,
  getDailyReadings
};
