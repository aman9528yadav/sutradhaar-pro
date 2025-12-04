import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Create a custom token for the user
        // We use the Clerk userId as the Firebase uid to link them
        const firebaseToken = await adminAuth.createCustomToken(userId);

        return NextResponse.json({ firebaseToken });
    } catch (error) {
        console.error('Error creating Firebase token:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
