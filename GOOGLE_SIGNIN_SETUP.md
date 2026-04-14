# Google Sign-In Setup Guide

## Issue
Google Sign-In is not working because it needs to be enabled in the Firebase Console.

## Steps to Enable Google Sign-In

### 1. Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **smart-hum**

### 2. Enable Google Authentication
1. In the left sidebar, click on **"Build"** → **"Authentication"**
2. Click on the **"Sign-in method"** tab
3. Find **"Google"** in the list of providers
4. Click on **"Google"**
5. Toggle the **"Enable"** switch to ON
6. Enter a **Project support email** (use your email address)
7. Click **"Save"**

### 3. Add Authorized Domains
1. Still in the **"Sign-in method"** tab, scroll down to **"Authorized domains"**
2. Make sure the following domains are listed:
   - `localhost` (for local development)
   - Your production domain (if deployed)
3. If not listed, click **"Add domain"** and add them

### 4. Test the Integration
After enabling Google Sign-In:
1. Run your development server: `npm run dev`
2. Navigate to the login page
3. Click on **"Sign in with Google"**
4. You should see a Google account selection popup
5. Select an account and authorize the app

## Common Issues and Solutions

### Issue: "This app is blocked"
**Solution**: Your app is in testing mode. To fix:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **"APIs & Services"** → **"OAuth consent screen"**
4. Add test users OR publish your app

### Issue: "Popup blocked"
**Solution**: Allow popups for localhost in your browser settings

### Issue: "Unauthorized domain"
**Solution**: Add your domain to the authorized domains list in Firebase Console

### Issue: "Invalid API key"
**Solution**: Verify your `.env.local` file has the correct Firebase configuration

## Email Verification Flow

### How It Works Now
1. **Sign Up**: User creates account → Verification email sent → Redirected to verify-email page
2. **Login**: 
   - If email is NOT verified → User is redirected to verify-email page
   - If email IS verified → User can access the app
3. **Google Sign-In**: Google accounts are automatically verified (no email verification needed)

### Benefits
- Prevents spam accounts
- Ensures valid email addresses
- Better security
- Users must verify email before accessing the app

## Testing the Email Verification

1. Create a new account with email/password
2. Check your email inbox for verification link
3. Click the verification link
4. You'll be automatically redirected to the app
5. Try logging in - it should work now!

## Notes
- Google accounts bypass email verification (they're pre-verified by Google)
- Email verification links expire after a certain time
- Users can resend verification emails from the verify-email page
- Unverified users cannot login with email/password
