# MotherCare - Postpartum Depression (PPD) Risk Analysis Platform

MotherCare is a modern web application designed to provide a safe, non-judgmental, and secure space for mothers to assess their postpartum health. The platform offers multiple screening methods for Postpartum Depression (PPD) and provides resources and community support to help mothers navigate their journey.



## 🌟 Key Features

### 🩺 PPD Risk Analysis

Assess your mental health through scientifically-backed screening methods:

- **EPDS (Edinburgh Postnatal Depression Scale)**: A standard screening tool.
- **Symptom-based Assessment**: Analyzing common symptoms.
- **Hybrid Method**: A comprehensive approach combining multiple indicators.

### 📊 Personal Wellness Dashboard

- **Screening History**: Track your progress over time with detailed logs.
- **Risk Overview**: Visualize your health data using interactive charts (powered by Recharts).
- **Actionable Insights**: Get recommendations based on your risk assessment level.

### 🤝 Community & Support

- **Support Groups**: Join groups of mothers sharing similar experiences.
- **Community Feed**: Share stories, ask questions, and offer support anonymously.
- **Expert Articles**: Read articles contributed by healthcare professionals.

### 🔐 Secure & Anonymous

- **Privacy First**: All assessments are 100% anonymous and secure.
- **Role-based Access**: Dedicated dashboards for Mothers, Contributors (Experts), and Admins.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Frontend library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Backend/Database**: [Firebase](https://firebase.google.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) 

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Jyoti-43/ppd_risk_analysis.git
   cd ppd_risk_analysis
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Firebase credentials:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

## 📂 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/component`: Reusable UI components organized by feature.
- `src/redux`: Redux slices and store configuration.
- `src/Hooks`: Custom React hooks.
- `src/lib`: Shared utility functions and configurations.
- `public`: Static assets like images and fonts.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 Credits & License

Developed as part of an 8th-semester project (PPD Risk Analysis). This project is currently for educational and demonstration purposes.

---

_Disclaimer: MotherCare is a screening tool and does not provide clinical diagnosis. Always consult with a healthcare professional for clinical advice._
