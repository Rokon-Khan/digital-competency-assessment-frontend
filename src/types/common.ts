export type UserRole = "admin" | "student" | "supervisor";

export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  supervisorApproved?: boolean;
  isApproved?: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: "student" | "supervisor";
  profile: {
    name: string;
    avatarUrl?: string;
    phone?: string;
  };
}

export interface APIError {
  status?: number;
  data?:
    | {
        error?: string;
        message?: string;
        [k: string]: unknown;
      }
    | string;
}

export interface Pagination<T> {
  items: T[];
  page: number;
  total: number;
  pages: number;
}

export interface QuestionOption {
  key: string;
  value: string;
}

export interface Question {
  _id: string;
  competency: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  text: string;
  options: QuestionOption[];
  correctOptionKey?: string; // hidden for students normally
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
  phone?: string;
}

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  supervisorApproved?: boolean;
  profile: UserProfile;
  currentLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentQuestion {
  questionId: string;
  competency: string;
  level: string;
}

export interface AssessmentAttempt {
  id?: string;
  _id?: string;
  step: number;
  questions: AssessmentQuestion[];
  status?: string;
  scorePercent?: number;
  levelAwarded?: string;
  advancedToNext?: boolean;
  startedAt?: string;
  submittedAt?: string;
}

export interface StartAssessmentResponse {
  attemptId: string;
  step: number;
  questions: AssessmentQuestion[];
}

export interface SubmitAssessmentPayload {
  attemptId: string;
  answers: Record<string, string>;
}

export interface AnalyticsUsers {
  data: {
    total: number;
    byRole: { _id: UserRole; count: number }[];
  };
}

export interface CompetencyPerformanceRow {
  competency: string;
  level: string;
  accuracy: number;
}

export interface AssessmentsAnalyticsRow {
  step: number;
  total: number;
  completionRate: number;
}
