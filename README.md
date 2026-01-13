# KiddoZ - Next Gen Childcare Management System

KiddoZ is a comprehensive childcare management platform integrating AI safety monitoring, real-time health tracking, and seamless parent-staff communication.

## 🚀 Key Features

### 👨‍👩‍👧 Parent Portal
*   **Live Dashboard**: Real-time view of attendance, mood, and meals.
*   **YOLOv8 Security Stream**: AI-powered live feed detecting student safety status.
*   **Rich Notifications**: Real-time alerts for health updates, observations, and staff notes.
*   **Medical Documents**: Secure access to uploaded health reports and vaccination records.
*   **Resource Library**: Curated educational content and critical downloads.

### 🛡️ Admin & Staff Portal
*   **Roster Management**: Complete CRUD operations for student records.
*   **Detailed Health Updates**: Staff can log vitals, internal notes, and parent-facing observations.
*   **Doctor Upload**: Secure medical record upload associated with specific students.
*   **Financial Dashboard**: Revenue tracking, forecasting, and payment stats.

### 🌐 Public Frontend
*   **Dynamic Program Pages**: Detailed views for Day Care, Pre-School, and Nanny services with high-quality local assets.
*   **AI Enrollment**: 3-Step flow including Biometric Registration and Plan selection.
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
3.  Run local server:
    ```bash
    npm run dev
    ```

## 🔐 Demo Access
The application supports **Anonymous Login** for demonstration purposes:
*   Click **"Parent View"** on the Login screen for a demo parent account.
*   Click **"Admin View"** on the Login screen for full administrative access.
