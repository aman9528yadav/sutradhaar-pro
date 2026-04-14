import * as admin from 'firebase-admin';

// Lazy initialization to avoid build-time errors
let adminInitialized = false;

function initializeFirebaseAdmin() {
    if (adminInitialized) {
        return;
    }

    let serviceAccount: any = null;

    // Try to load credentials from different sources
    // Priority: 1) Base64 encoded JSON, 2) Raw JSON string, 3) Individual env vars

    if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
        // Option 1: Base64-encoded service account (recommended for Netlify)
        try {
            const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf-8');
            serviceAccount = JSON.parse(decoded);
        } catch (error) {
            console.error('Error decoding base64 service account:', error);
        }
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Option 2: Raw JSON string
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch (error) {
            console.error('Error parsing service account JSON:', error);
        }
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        // Option 3: Individual environment variables (for local development)
        serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };
    }

    // Check if running in a build environment (no credentials needed)
    if (!serviceAccount || !serviceAccount.projectId) {
        console.warn('Firebase Admin credentials not found. Skipping initialization.');
        return;
    }

    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
            });
            adminInitialized = true;
            console.log('Firebase Admin initialized successfully');
        } catch (error) {
            console.error('Error initializing Firebase Admin:', error);
            throw error;
        }
    } else {
        adminInitialized = true;
    }
}

// Export a function that returns the auth instance
export function getAdminAuth() {
    initializeFirebaseAdmin();

    if (!adminInitialized) {
        throw new Error('Firebase Admin is not initialized. Please check your environment variables.');
    }

    return admin.auth();
}
