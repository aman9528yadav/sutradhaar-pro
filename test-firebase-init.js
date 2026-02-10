
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

console.log('Config:', firebaseConfig);

try {
  initializeApp(firebaseConfig);
  console.log('Success');
} catch (e) {
  console.error('Error:', e.message);
}
