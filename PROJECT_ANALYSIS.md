# KiddoZ Childcare System - Project Analysis & Tech Stack

## 1. Project Structure Analysis
The project follows a **Client-Server Architecture** (Monorepo style).

```text
kiddoz-childcare-system/
├── dist/                   # Production build artifacts (Frontend)
├── server/                 # Backend Application
│   ├── models/             # Sequelize Database Models (Student, Staff, etc.)
│   ├── routes/             # API Route Definitions (Auth, AI, Financials, etc.)
│   ├── server.js           # Entry Point (Express App)
│   ├── database.sqlite     # SQLite Database File
│   └── seed.js             # Database Seeding Script
├── src/                    # Frontend Application
│   ├── assets/             # Images and Static Resources
│   ├── components/         # React Components (Admin, Dashboard, Layout, UI)
│   │   ├── ai/             # AI Features (Chatbot, LiveViewYOLO)
│   │   └── ...
│   ├── context/            # Global State (AuthContext, ToastContext)
│   ├── services/           # API Services (axios, yoloService)
│   └── App.jsx             # Main Application Router
├── public/                 # Static Public Assets
├── package.json            # Frontend Dependencies & Scripts
├── tailwind.config.js      # CSS Framework Configuration
└── vite.config.js          # Build Tool Configuration
```

## 2. Technology Stack

### Frontend
-   **Core**: React 18, JavaScript (ES Modules).
-   **Build Tool**: Vite.
-   **Styling**: TailwindCSS, PostCSS.
-   **Routing**: React Router DOM v6/v7.
-   **AI/ML**: TensorFlow.js (`@tensorflow/tfjs`, `@tensorflow-models/coco-ssd`) for Object Detection.
-   **Icons**: Lucide React.
-   **HTTP Client**: Axios.

### Backend (`/server`)
-   **Runtime**: Node.js.
-   **Framework**: Express.js.
-   **Database**: SQLite3.
-   **ORM**: Sequelize.
-   **Authentication**: JSON Web Tokens (JWT), Bcryptjs.
-   **AI Integration**: Google Gemini API (Generative Language).
-   **Security**: Helmet, Cors.

## 3. Environment Variables
The application relies on the following environment variables (defined in `server/.env`):

| Variable | Description | Current Status |
| :--- | :--- | :--- |
| `PORT` | Backend Server Port | Default: `5001` |
| `JWT_SECRET` | Secret key for signing Session Tokens | Configured |
| `GEMINI_API_KEY` | Google API Key for AI Chat | **Issue Detected**: Key blocked/quota exceeded |

## 4. Current Critical Issues & Solutions

### A. AI Chat ("Not working properly")
-   **Root Cause**: The configured `GEMINI_API_KEY` is invalid or has exceeded its billing quota, causing the backend to crash or return error 500s.
-   **Solution**: Implemented a **Resilient Mock Fallback**. If the external AI service fails, the backend now seamlessly switches to a simulated internal "AI" that provides relevant responses based on context (Health, General Info) without breaking the user experience.

### B. Live View ("Not working perfectly")
-   **Root Cause**:
    -   **Aspect Ratio Mismatch**: The Object Detection canvas is hardcoded to 640x480, which may not match the display aspect ratio, causing misaligned bounding boxes.
    -   **Demo Mode Realism**: The current simulation is basic.
-   **Solution**:
    -   Update `LiveViewYOLO.jsx` to dynamically respect the video feed's aspect ratio.
    -   Ensure smooth overlay rendering.
    -   Optimize the YOLO detection loop for better performance.
