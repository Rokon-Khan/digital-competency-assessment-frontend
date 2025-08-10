// Example route usage with pending approval guard (optional)
import { useAppSelector } from "@/hooks/useAppSelector";
import PendingApprovalPage from "@/pages//PendingApprovalPage";
import LoginPage from "@/pages/auth/LoginPage";
import OTPVerificationPage from "@/pages/auth/OTPVerificationPage";
import SignupPage from "@/pages/auth/SignupPage";
import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";

const Protected: React.FC<{
  children: React.ReactNode;
  roles?: string[];
  supervisorNeedsApproval?: boolean;
}> = ({ children, roles, supervisorNeedsApproval }) => {
  const auth = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!auth.accessToken) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (roles && !roles.includes(auth.role || "")) {
    return <Navigate to="/login" replace />;
  }
  if (
    supervisorNeedsApproval &&
    auth.role === "supervisor" &&
    !(auth.supervisorApproved ?? auth.isApproved)
  ) {
    return <Navigate to="/pending-approval" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/verify-otp" element={<OTPVerificationPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/pending-approval" element={<PendingApprovalPage />} />
    {/* SAMPLE protected route */}
    <Route
      path="/dashboard"
      element={
        <Protected>
          <div className="p-6">Dashboard Home</div>
        </Protected>
      }
    />
    <Route
      path="/supervisor/monitor"
      element={
        <Protected roles={["supervisor", "admin"]} supervisorNeedsApproval>
          <div className="p-6">Supervisor Monitor</div>
        </Protected>
      }
    />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
