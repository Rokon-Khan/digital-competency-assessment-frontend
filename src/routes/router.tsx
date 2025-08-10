// import { Layout } from "@/components/Layout";
import { Layout } from "@/components/common/Layout";
import LoginPage from "@/pages/auth/LoginPage";
import OTPVerificationPage from "@/pages/auth/OTPVerificationPage";
import SignupPage from "@/pages/auth/SignupPage";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/ProfilePage";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "verify-otp", element: <OTPVerificationPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
