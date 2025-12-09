import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_PATH = path.join(__dirname, '../data/subscribers.json');

let subscribers = {
  users: {},
  channels: []
};

function loadSubscribers() {
  try {
    if (fs.existsSync(STORAGE_PATH)) {
      const data = fs.readFileSync(STORAGE_PATH, 'utf8');
      subscribers = JSON.parse(data);
      console.log(`Loaded ${Object.keys(subscribers.users).length} users and ${subscribers.channels.length} channels`);
    }
  } catch (error) {
    console.error('Error loading subscribers:', error.message);
    subscribers = { users: {}, channels: [] };
  }
  return subscribers;
}

function saveSubscribers() {
  try {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving subscribers:', error.message);
    return false;
  }
}

function addUser(chatId, userData = {}) {
  const id = String(chatId);
  if (!subscribers.users[id]) {
    subscribers.users[id] = {
      chatId: id,
      subscribed: true,
      subscribedAt: new Date().toISOString(),
      ...userData
    };
    saveSubscribers();
    return true;
  }
  return false;
}

function subscribeUser(chatId) {
  const id = String(chatId);
  if (subscribers.users[id]) {
    subscribers.users[id].subscribed = true;
    subscribers.users[id].subscribedAt = new Date().toISOString();
    saveSubscribers();
    return true;
  }
  addUser(chatId);
  return true;
}

function unsubscribeUser(chatId) {
  const id = String(chatId);
  if (subscribers.users[id]) {
    subscribers.users[id].subscribed = false;
    subscribers.users[id].unsubscribedAt = new Date().toISOString();
    saveSubscribers();
    return true;
  }
  return false;
}

function isUserSubscribed(chatId) {
  const id = String(chatId);
  return subscribers.users[id]?.subscribed === true;
}

function getSubscribedUsers() {
  return Object.values(subscribers.users).filter(u => u.subscribed === true);
}

function addChannel(channelId) {
  const id = String(channelId);
  if (!subscribers.channels.includes(id)) {
    subscribers.channels.push(id);
    saveSubscribers();
    return true;
  }
  return false;
}

function removeChannel(channelId) {
  const id = String(channelId);
  const index = subscribers.channels.indexOf(id);
  if (index > -1) {
    subscribers.channels.splice(index, 1);
    saveSubscribers();
    return true;
  }
  return false;
}

function getChannels() {
  return subscribers.channels;
}

function getStats() {
  return {
    totalUsers: Object.keys(subscribers.users).length,
    subscribedUsers: getSubscribedUsers().length,
    channels: subscribers.channels.length
  };
}

loadSubscribers();

export {
  loadSubscribers,
  addUser,
  subscribeUser,
  unsubscribeUser,
  isUserSubscribed,
  getSubscribedUsers,
  addChannel,
  removeChannel,
  getChannels,
  getStats
};
