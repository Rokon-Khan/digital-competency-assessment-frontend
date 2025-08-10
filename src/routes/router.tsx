// import { Layout } from "@/components/Layout";
import { Layout } from "@/components/common/Layout";
import LoginPage from "@/pages/auth/LoginPage";
import OTPVerificationPage from "@/pages/auth/OTPVerificationPage";
import SignupPage from "@/pages/auth/SignupPage";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "otp-verification", element: <OTPVerificationPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
