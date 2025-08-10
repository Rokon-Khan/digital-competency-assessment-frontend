# Digital Competency Assessment System

The **Digital Competency Assessment System** is a robust, secure, and user-friendly web application designed to evaluate users' digital skills through a structured 3-step assessment process based on the Test_School framework (A1 to C2 levels). The platform automates skill evaluation, certification, and user management with a focus on security, performance, and responsive design. Deployed at [https://digital-competency-assessment.surge.sh](https://digital-competency-assessment.surge.sh), it provides an intuitive interface for students, admins, and supervisors.

## 📖 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 📝 Project Overview
The Digital Competency Assessment System enables users to test and certify their digital competencies through a progressive 3-step evaluation process. It includes features like secure authentication, timed assessments, certification generation, and admin dashboards for managing users and questions. The system ensures a secure exam environment and adheres to industry-standard coding practices for scalability and maintainability.

## ✨ Features
- **3-Step Assessment Flow**:
  - Step 1: Levels A1 & A2 (44 questions, <25% fails with no retake).
  - Step 2: Levels B1 & B2.
  - Step 3: Levels C1 & C2.
  - Automated scoring and certification (A1–C2) based on performance.
- **Timer System**:
  - Configurable countdown timer (default: 1 minute per question).
  - Auto-submission on time expiration.
- **Authentication & User Management**:
  - User roles: Admin, Student, Supervisor.
  - JWT-based authentication with email OTP verification.
  - Password reset and profile management.
- **Question Pool**:
  - 132 questions across 22 competencies and 6 levels.
  - Randomized question selection for each assessment step.
- **Certification**:
  - Automatic digital certificate generation.
  - Downloadable PDF certificates with email delivery support.
- **Admin Dashboard**:
  - Paginated tables for managing users, questions, and assessments.
  - Analytics for user performance and competency trends.
- **Secure Exam Environment** (Bonus):
  - Integration with Safe Exam Browser (SEB) for restricted navigation.
  - Support for live video monitoring (optional).
- **Responsive Design**:
  - Mobile-optimized UI using TailwindCSS and Shadcn components.
- **State Management**:
  - Centralized state management with Redux and RTK Query for seamless API interactions.

## 🛠 Tech Stack
- **Frontend**:
  - **React.js**: Component-based UI development.
  - **TypeScript**: Type-safe JavaScript for better code reliability.
  - **Redux & RTK Query**: State management and API handling.
  - **Shadcn**: Reusable, customizable UI components.
  - **TailwindCSS**: Utility-first CSS for responsive styling.
  - **Vite**: Fast build tool and development server.
- **Backend** (Assumed for completeness):
  - Node.js, Express, TypeScript.
  - MongoDB with Mongoose for data storage.
  - JWT and bcrypt for authentication.
  - Redis for OTP verification.
  - Nodemailer for email delivery.
- **Deployment**:
  - Hosted on Surge ([https://digital-competency-assessment.surge.sh](https://digital-competency-assessment.surge.sh)).

## 🚀 Installation
Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v16 or higher)
- npm or Yarn
- Git

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/digital-competency-assessment-frontend.git
   cd digital-competency-assessment
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   Replace `http://localhost:5000/api` with your backend API URL.

4. **Run the Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173`.

5. **Build for Production**:
   ```bash
   npm run build
   # or
   yarn build
   ```

6. **Preview Production Build**:
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## 📚 Usage
1. **Registration & Login**:
   - Register with your email and verify via OTP.
   - Log in to access the assessment or admin dashboard based on your role.
2. **Assessment**:
   - Start the 3-step assessment process (44 questions per step).
   - Answer questions within the time limit; answers auto-submit on timeout.
   - Receive certification based on your score (A1–C2).
3. **Admin Dashboard**:
   - Admins can manage users, questions, and view analytics.
   - Use paginated tables for efficient data management.
4. **Certificates**:
   - View and download certificates as PDFs.
   - Request email delivery of certificates.
5. **Supervisor Features**:
   - Monitor active assessments in real-time.
   - Invalidate sessions if cheating is detected.

## 📂 Project Structure
```plaintext
/src
  /components
    /common         # Reusable components (Button, Input, Table)
    /auth           # Auth components (LoginForm, RegisterForm)
    /assessment     # Assessment components (QuestionCard, Timer)
    /dashboard      # Dashboard components (AdminTable, StudentDashboard)
    /certificate    # Certificate components (CertificateCard, DownloadButton)
  /pages
    Login.tsx       # Login page
    Register.tsx    # Registration page
博览会 Assessment.tsx  # Assessment page
    Dashboard.tsx   # Admin/Student/Supervisor dashboard
    Certificate.tsx # Certificate view/download page
  /redux
    /slices         # Redux slices (auth, user, assessment)
    /api            # RTK Query API definitions
    store.ts        # Redux store configuration
  /utils
    api.ts          # Axios instance for API calls
    constants.ts    # Constants (API URLs, roles)
  /styles
    tailwind.css    # TailwindCSS configuration
  App.tsx           # Main app component
  main.tsx          # Entry point
  vite.config.ts    # Vite configuration
```


## 📜 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using modern web technologies to empower digital skill assessment.
