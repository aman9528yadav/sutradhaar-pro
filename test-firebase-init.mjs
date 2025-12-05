
import { initializeApp } from 'firebase/app';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

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
