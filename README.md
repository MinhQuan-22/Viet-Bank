# VietBank - Digital Banking Application

## Overview
VietBank is a comprehensive digital banking platform designed to provide a secure, convenient, and modern financial experience for both individual customers and bank officers. The system integrates fundamental financial transactions with lifestyle services such as hotel and movie ticket bookings, creating a closed-loop digital service ecosystem.

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, Framer Motion, Recharts
- **Backend:** Firebase (BaaS), Firebase Functions (Node.js) for serverless business logic
- **Database:** Cloud Firestore (Structured data) & Realtime Database (Instant sync data)
- **Tools:** Capacitor (Mobile Hybrid), EmailJS (OTP gateway), Cloudinary (eKYC)

## Key Features
- **Account Management:** Real-time tracking of balances, account details (Checking, Saving, Mortgage), and transaction history.
- **Transfers:** Internal and interbank transfers with secure OTP/Biometric authentication workflows.
- **QR Payments:** Integrated QR code scanner and personal QR code generation for quick receiving.
- **Electronic KYC (eKYC):** Online identity verification and document update workflow.
- **Lifestyle Utilities:** Hotel booking with map integration and movie ticket booking with seat selection.
- **Officer Dashboard:** Comprehensive customer management, transaction monitoring, and interest rate configuration.

## My Responsibilities
- Backend development and serverless functions integration
- Database design (Firestore and Realtime Database structure)
- API integration for third-party services (EmailJS, Cloudinary, Geocoding)
- Testing/documentation (Unit testing with Vitest, property-based testing)

## Screenshots
*(Add images here - e.g. test pass screenshot, transaction flow, dashboard)*

## Setup Instructions
1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   cd functions && npm install
   ```
3. Configure environment variables (Use the provided `.env.example` as a reference. Ensure no real keys are committed):
   ```bash
   cp .env.example .env
   ```
4. Run project locally:
   ```bash
   npm run dev
   ```
5. Run automated tests to verify integrity:
   ```bash
   npm run test
   ```

See [README.txt](./README.txt) for detailed setup instructions and database seeding.

## Demo Accounts
- **Admin/Officer:** `officer@vietbank.com` (Check README.txt for password/OTP details)
- **User:** `user@vietbank.com` (Check README.txt for password/OTP details)

## Known Limitations
- The application uses Firebase Emulators for local development. Some edge cases related to production-level Firebase limitations might not be fully tested.
- Cinema service currently loads all showtimes locally without explicit indexing (to be optimized).
- Officer/Admin features like creating customers and accounts currently use placeholder logic to be integrated with Firebase later.

## Notes
This is an academic/personal project built for learning and portfolio purposes.
