/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useResendOtpMutation,
  useVerifyEmailMutation,
} from "@/redux/services/assessmentApi";
import { ArrowLeft, Check, Mail, RotateCcw } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

interface LocationState {
  email?: string;
  role?: "student" | "supervisor";
  supervisorApprovalRequired?: boolean;
}

const OTP_LENGTH = 6;
const INITIAL_TIMER = 120; // seconds

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const email = state.email;

  const [verifyEmail, { isLoading: verifying }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => "")
  );
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIMER);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    if (!email) {
      toast.error("Missing email context, please sign up again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < OTP_LENGTH - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;

  const doVerify = useCallback(async () => {
    if (!email) return;
    if (!isComplete) {
      toast.error("Please enter all digits");
      return;
    }
    try {
      await verifyEmail({ email, otp: code }).unwrap();
      toast.success("Email verified successfully");
      // Option: auto redirect to login
      navigate("/login", { replace: true });
    } catch (e: any) {
      const msg =
        e?.data?.error ||
        e?.data?.message ||
        "Invalid or expired OTP. Please try again.";
      toast.error(msg);
    }
  }, [code, email, isComplete, navigate, verifyEmail]);

  const doResend = async () => {
    if (!email) return;
    try {
      await resendOtp({ email }).unwrap();
      toast.success("OTP resent to your email");
      setTimeLeft(INITIAL_TIMER);
      setCanResend(false);
      setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
      // Focus first input
      setTimeout(() => {
        document.getElementById("otp-0")?.focus();
      }, 50);
    } catch (e: any) {
      toast.error(e?.data?.error || e?.data?.message || "Failed to resend OTP");
    }
  };

  useEffect(() => {
    // Auto-submit when all digits entered
    if (isComplete) {
      // optional: doVerify();
    }
  }, [isComplete]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-primary rounded-lg p-3 w-fit mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We sent a 6‑digit verification code to
              <br />
              <span className="font-medium text-foreground break-all">
                {email}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {digits.map((d, i) => (
                  <Input
                    key={i}
                    id={`otp-${i}`}
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Time remaining:{" "}
                    <span className="font-medium text-primary">
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-destructive font-medium">
                    OTP expired! Request a new one.
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={doVerify}
              variant="hero"
              className="w-full"
              disabled={!isComplete || verifying}
            >
              {verifying ? (
                <>
                  <Check className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            <div className="space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the code?
              </p>
              <Button
                variant="outline"
                onClick={doResend}
                disabled={!canResend || resending}
                className="w-full"
              >
                {resending ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/signup")}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign Up
              </Button>
            </div>

            {/* Optional helper message */}
            <div className="bg-muted/50 rounded-lg p-4 text-center text-xs text-muted-foreground">
              If you still don&apos;t see the code, check spam or resend after
              the timer.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
