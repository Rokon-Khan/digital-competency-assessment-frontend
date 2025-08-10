/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AnalyticsUsers,
  AssessmentAttempt,
  AssessmentsAnalyticsRow,
  AuthLoginResponse,
  CompetencyPerformanceRow,
  Pagination,
  Question,
  RegisterPayload,
  StartAssessmentResponse,
  SubmitAssessmentPayload,
  User,
} from "@/types/common";
import { createApi } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../fetures/authSlice";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const assessmentApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Auth",
    "User",
    "Users",
    "Questions",
    "Assessment",
    "Certificate",
    "Analytics",
    "Supervisor",
  ],
  endpoints: (builder) => ({
    // AUTH
    register: builder.mutation<
      { message: string; userId: string; supervisorApprovalRequired: boolean },
      RegisterPayload
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        data: body,
      }),
    }),
    verifyEmail: builder.mutation<
      { message: string },
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        data: body,
      }),
    }),
    resendOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        data: body,
      }),
    }),
    login: builder.mutation<
      AuthLoginResponse,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              role: data.role,
              supervisorApproved: data.supervisorApproved,
              isApproved: data.isApproved,
            })
          );
        } catch {
          /* ignore */
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User", "Assessment"],
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data: body,
      }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      { email: string; otp: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        data: body,
      }),
    }),

    // CURRENT USER
    getMe: builder.query<{ user: User }, void>({
      query: () => ({ url: "/users/me" }),
      providesTags: ["User"],
    }),
    updateMe: builder.mutation<
      { user: User },
      Partial<{ name: string; avatarUrl: string; phone: string }>
    >({
      query: (body) => ({
        url: "/users/me",
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["User"],
    }),

    // ADMIN USERS
    listUsers: builder.query<
      Pagination<User>,
      {
        page?: number;
        limit?: number;
        role?: string;
        supervisorApproved?: boolean;
      }
    >({
      query: ({ page = 1, limit = 20, role, supervisorApproved } = {}) => ({
        url: "/admin/users",
        params: { page, limit, role, supervisorApproved },
      }),
      providesTags: ["Users"],
    }),
    getUserById: builder.query<{ user: User }, string>({
      query: (id) => ({ url: `/admin/users/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "Users", id }],
    }),
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),
    approveSupervisor: builder.mutation<
      { message: string; userId: string },
      string
    >({
      query: (id) => ({
        url: `/admin/users/${id}/approve-supervisor`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    // QUESTIONS (Admin)
    listQuestions: builder.query<
      Pagination<Question>,
      { page?: number; limit?: number; level?: string; competency?: string }
    >({
      query: ({ page = 1, limit = 20, level, competency } = {}) => ({
        url: "/admin/questions",
        params: { page, limit, level, competency },
      }),
      providesTags: (res) =>
        res
          ? [
              ...res.items.map((q) => ({
                type: "Questions" as const,
                id: q._id,
              })),
              { type: "Questions", id: "LIST" },
            ]
          : [{ type: "Questions", id: "LIST" }],
    }),
    getQuestion: builder.query<{ question: Question }, string>({
      query: (id) => ({ url: `/admin/questions/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "Questions", id }],
    }),
    createQuestion: builder.mutation<{ question: Question }, Partial<Question>>(
      {
        query: (body) => ({
          url: "/admin/questions",
          method: "POST",
          data: body,
        }),
        invalidatesTags: [{ type: "Questions", id: "LIST" }],
      }
    ),
    updateQuestion: builder.mutation<
      { question: Question },
      { id: string; data: Partial<Question> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/questions/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Questions", id }],
    }),
    deleteQuestion: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "Questions", id }],
    }),
    bulkQuestions: builder.mutation<{ count: number }, Question[]>({
      query: (data) => ({
        url: "/admin/questions/bulk",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Questions", id: "LIST" }],
    }),

    // ASSESSMENT
    startAssessment: builder.query<StartAssessmentResponse, void>({
      query: () => ({ url: "/assessment/start" }),
      providesTags: ["Assessment"],
    }),
    submitAssessment: builder.mutation<
      { attempt: AssessmentAttempt },
      SubmitAssessmentPayload
    >({
      query: (body) => ({
        url: "/assessment/submit",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Assessment", "Certificate"],
    }),
    assessmentStatus: builder.query<{ attempts: AssessmentAttempt[] }, void>({
      query: () => ({ url: "/assessment/status" }),
      providesTags: ["Assessment"],
    }),
    assessmentHistory: builder.query<{ attempts: AssessmentAttempt[] }, void>({
      query: () => ({ url: "/assessment/history" }),
      providesTags: ["Assessment"],
    }),

    // CERTIFICATE
    getCertificate: builder.query<
      { certificate: { id: string; serial: string; level: string } },
      void
    >({
      query: () => ({ url: "/assessment/certificate" }),
      providesTags: ["Certificate"],
    }),

    // ANALYTICS
    analyticsUsers: builder.query<AnalyticsUsers, void>({
      query: () => ({ url: "/analytics/users" }),
      providesTags: ["Analytics"],
    }),
    analyticsCompetency: builder.query<
      { data: CompetencyPerformanceRow[] },
      void
    >({
      query: () => ({ url: "/analytics/competency" }),
      providesTags: ["Analytics"],
    }),
    analyticsAssessments: builder.query<
      { data: AssessmentsAnalyticsRow[] },
      void
    >({
      query: () => ({ url: "/analytics/assessments" }),
      providesTags: ["Analytics"],
    }),

    // SUPERVISOR
    monitorUser: builder.query<
      {
        attempt: {
          id: string;
          step: number;
          startedAt: string;
          status: string;
          questionCount: number;
          telemetry: any;
        } | null;
        message?: string;
      },
      string
    >({
      query: (userId) => ({ url: `/supervisor/monitor/${userId}` }),
      providesTags: ["Supervisor"],
    }),
    invalidateAttempt: builder.mutation<
      {
        message: string;
        attemptId: string;
        previousStatus: string;
        newStatus: string;
        reason: string;
      },
      string
    >({
      query: (userId) => ({
        url: `/supervisor/invalidate/${userId}`,
        method: "POST",
        data: { reason: "Manual invalidation" },
      }),
      invalidatesTags: ["Supervisor", "Assessment"],
    }),
  }),
});

// Export hooks
export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,

  useGetMeQuery,
  useUpdateMeMutation,

  useListUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useApproveSupervisorMutation,

  useListQuestionsQuery,
  useGetQuestionQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useBulkQuestionsMutation,

  useStartAssessmentQuery,
  useSubmitAssessmentMutation,
  useAssessmentStatusQuery,
  useAssessmentHistoryQuery,

  useGetCertificateQuery,

  useAnalyticsUsersQuery,
  useAnalyticsCompetencyQuery,
  useAnalyticsAssessmentsQuery,

  useMonitorUserQuery,
  useInvalidateAttemptMutation,
} = assessmentApi;
