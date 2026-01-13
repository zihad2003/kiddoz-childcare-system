# KiddoZ - Next Gen Childcare Management System

KiddoZ is a comprehensive childcare management platform integrating AI safety monitoring, real-time health tracking, and seamless parent-staff communication.

## 🚀 Key Features

### 👨‍👩‍👧 Parent Portal
*   **Live Dashboard**: Real-time view of attendance, mood, and meals.
*   **YOLOv8 Security Stream**: AI-powered live feed detecting student safety status.
*   **Health Tracking**: Visualization of developmental milestones and vitals trends.
*   **Resource Library**: Curated educational content and critical downloads.

### 🛡️ Admin & Staff Portal
*   **Roster Management**: Complete CRUD operations for student records.
*   **Deep Health Logs**: Detailed logging for incidents, meals, and medical checks.
*   **Financial Dashboard**: Revenue tracking, forecasting, and payment stats.
*   **System Controls**: One-click maintenance mode and notification settings.

### 🌐 Public Frontend
*   **Dynamic Program Pages**: Detailed views for Day Care, Pre-School, and Nanny services.
*   **Smart Booking**: Interactive Tour Booking system with calendar integration.
*   **AI Enrollment**: 3-Step flow including Biometric Registration.
*   **AI Chatbot**: Dual-mode assistant (General Inquiries & Health Data Analysis).

## 🛠️ Tech Stack
*   **Frontend**: React + Vite
*   **Styling**: Tailwind CSS + Lucide Icons + Google Fonts (Outfit)
*   **Backend / Data**: Firebase (Auth, Firestore)
*   **AI / ML**: 
    *   YOLOv8 (Simulated for Live View)
    *   Gemini API (Chatbot Logic)

## 📦 Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up Environment Variables (Firebase config in `src/App.jsx` or `.env`).
4.  Run local server:
    ```bash
    npm run dev
    ```

## 🔐 Demo Access
The application supports **Anonymous Login** for demonstration purposes:
*   Click **"Parent View"** on the Login screen for a demo parent account.
*   Click **"Admin View"** on the Login screen for full administrative access.
