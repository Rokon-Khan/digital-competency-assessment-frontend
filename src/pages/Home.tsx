import {
  Award,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  FileBadge,
  GraduationCap,
  Layers,
  Library,
  Shield,
  ShieldCheck,
  Target,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import React, { useMemo } from "react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAnalyticsUsersQuery, useListQuestionsQuery } from "@/redux/services/assessmentApi";

/**
 * Home / Landing Page
 * - Shows hero CTA
 * - Dynamic stats (users / questions) if analytics endpoints succeed
 * - Full feature showcase section
 * - Assessment steps overview
 * - Final CTA
 */

const Home: React.FC = () => {
  const auth = useAppSelector((s) => s.auth);
  const isAuthenticated = !!auth.accessToken;

  // Optional analytics calls (skip on unauthenticated if backend restricts).
  const { data: userAnalytics } = useAnalyticsUsersQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Example fetch for questions (first page just to derive count)
  const { data: questionPage } = useListQuestionsQuery(
    { page: 1, limit: 1 },
    { skip: !isAuthenticated }
  );

  const totalUsers = userAnalytics?.data?.total ?? 0;
  const totalQuestions = useMemo(() => {
    // If backend returns pagination meta (pages * limit) you can approximate.
    // Here we only have a first page request; replace with real meta if available.
    // For now fallback to a static marketing number if not logged in.
    if (!isAuthenticated) return 132;
    return questionPage?.items ? "• • •" : 0;
  }, [questionPage, isAuthenticated]);

  // Main feature list (expanded)
  const features = [
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Progressive Assessment",
      description:
        "Three strategic stages from foundational to expert mastery.",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Timed Evaluations",
      description: "Auto‑submission with calibrated timers for fairness.",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Secure Session",
      description: "Session integrity & anti‑tamper environment.",
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Digital Certification",
      description: "Instant certificate generation upon completion.",
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "Competency Mapping",
      description: "Granular tracking across 22+ digital competencies.",
    },
    {
      icon: <Layers className="h-6 w-6 text-primary" />,
      title: "Adaptive Levels",
      description: "Structured A1 → C2 pathway with performance gates.",
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Role-Based Access",
      description: "Admin, Supervisor & Student experiences separated.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Analytics Dashboard",
      description: "Visual insights into performance & progression.",
    },
    {
      icon: <FileBadge className="h-6 w-6 text-primary" />,
      title: "Question Management",
      description: "Admin CRUD + bulk question operations.",
    },
    {
      icon: <Library className="h-6 w-6 text-primary" />,
      title: "Rich Question Bank",
      description: "Curated multi‑level pool with competency tags.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Supervisor Oversight",
      description: "Real‑time attempt monitoring & invalidation tools.",
    },
    {
      icon: <Cpu className="h-6 w-6 text-primary" />,
      title: "Scalable API",
      description: "Optimized backend (MongoDB + Redis) for throughput.",
    },
    {
      icon: <Workflow className="h-6 w-6 text-primary" />,
      title: "OTP & Secure Auth",
      description: "Email verification, token rotation & refresh flows.",
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Fast UX",
      description: "RTK Query caching & client‑side state performance.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Step 1: Foundation",
      levels: "A1 & A2",
      description:
        "Establish baseline digital literacy and core handling skills.",
      criteria: "≥ 75% to advance; ≥ 25% minimum to pass.",
    },
    {
      step: "02",
      title: "Step 2: Intermediate",
      levels: "B1 & B2",
      description: "Evaluate applied problem solving & tool integration.",
      criteria: "≥ 75% to advance; ≥ 25% minimum to pass.",
    },
    {
      step: "03",
      title: "Step 3: Advanced",
      levels: "C1 & C2",
      description: "Measure strategic & high‑complexity digital competencies.",
      criteria: "≥ 50% for C2 certification.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              Digital Competency Platform
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Master Your
              <span className="bg-gradient-primary bg-clip-text text-transparent ml-3">
                Digital Skills
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Comprehensive assessment platform for structured progression from
              A1 to C2. Validate and certify your digital competency with
              measurable performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Button variant="hero" size="xl" asChild>
                  <Link to="/assessment" className="gap-2">
                    Continue Assessment
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/signup" className="gap-2">
                      Start Assessment
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="xl" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {isAuthenticated ? totalUsers || "—" : "1.2K+"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Registered Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">
                  Skill Levels
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Questions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">Why Choose Test_School?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete, secure, and data‑driven framework for digital skills
              verification and credentialing.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="border-border/50 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="bg-primary/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-base font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Journey / Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">Assessment Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A progressive pathway designed to validate breadth and depth of
              digital competence.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            {steps.map((s) => (
              <Card
                key={s.step}
                className="border-border/50 hover:shadow-md transition-all"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow">
                        {s.step}
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-semibold mb-1">{s.title}</h3>
                      <Badge variant="secondary" className="mb-3">
                        {s.levels}
                      </Badge>
                      <p className="text-muted-foreground mb-2">
                        {s.description}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Criteria: {s.criteria}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-8 w-8 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="xl" asChild>
              <Link
                to={isAuthenticated ? "/assessment" : "/signup"}
                className="gap-2"
              >
                {isAuthenticated ? "Resume Assessment" : "Get Started"}
                <GraduationCap className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Prove Your Digital Skills?
            </h2>
            <p className="text-lg opacity-90 mb-8 leading-relaxed">
              Join professionals advancing their careers through validated
              digital competency certification on Test_School.
            </p>
            <Button variant="secondary" size="xl" asChild>
              <Link
                to={isAuthenticated ? "/assessment" : "/signup"}
                className="gap-2"
              >
                Begin Assessment
                <Zap className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
