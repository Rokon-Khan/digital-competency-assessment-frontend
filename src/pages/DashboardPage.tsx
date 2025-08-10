import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { 
  Award, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  Play,
  Download,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Layout } from '@/components/layout/Layout';
import { RootState } from '@/store';
import { mockQuizSessions } from '@/data/mockData';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { sessions, availableSteps } = useSelector((state: RootState) => state.quiz);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const userSessions = sessions.length > 0 ? sessions : mockQuizSessions;
  const completedSteps = user?.completedSteps || [1, 2];
  const currentLevel = user?.certificationLevel || 'B2';

  const getNextStep = () => {
    if (completedSteps.includes(3)) return null;
    if (completedSteps.includes(2)) return 3;
    if (completedSteps.includes(1)) return 2;
    return 1;
  };

  const nextStep = getNextStep();

  const stats = {
    totalQuizzes: userSessions.length,
    averageScore: userSessions.length > 0 ? 
      Math.round(userSessions.reduce((acc, session) => acc + session.score, 0) / userSessions.length) : 0,
    totalTime: userSessions.reduce((acc, session) => {
      if (session.endTime && session.startTime) {
        return acc + Math.round((session.endTime - session.startTime) / 60000); // minutes
      }
      return acc;
    }, 0),
    bestScore: userSessions.length > 0 ? Math.max(...userSessions.map(s => s.score)) : 0
  };

  return (
   
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Track your digital competency progress and achievements
            </p>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Current Certification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {currentLevel}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Digital Competency Level
                  </p>
                  {nextStep && (
                    <Button variant="hero" asChild>
                      <div className="cursor-pointer" onClick={() => navigate('/quiz')}>
                        <Play className="h-4 w-4 mr-2" />
                        Continue to Step {nextStep}
                      </div>
                    </Button>
                  )}
                  {!nextStep && (
                    <Badge variant="secondary" className="text-success">
                      All Steps Completed
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map(step => {
                    const isCompleted = completedSteps.includes(step);
                    const isAvailable = availableSteps.includes(step);
                    
                    return (
                      <div key={step} className="flex items-center justify-between">
                        <span className="text-sm font-medium">Step {step}</span>
                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <CheckCircle className="h-4 w-4 text-success" />
                          )}
                          {!isCompleted && isAvailable && (
                            <AlertCircle className="h-4 w-4 text-warning" />
                          )}
                          <Badge 
                            variant={isCompleted ? "secondary" : isAvailable ? "outline" : "secondary"}
                            className={isCompleted ? "text-success" : ""}
                          >
                            {isCompleted ? "Completed" : isAvailable ? "Available" : "Locked"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-primary">{stats.totalQuizzes}</CardTitle>
                <CardDescription>Quizzes Taken</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-primary">{stats.averageScore}%</CardTitle>
                <CardDescription>Average Score</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-primary">{stats.totalTime}m</CardTitle>
                <CardDescription>Total Time</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-primary">{stats.bestScore}%</CardTitle>
                <CardDescription>Best Score</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSessions.slice(0, 3).map((session, index) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">Step {session.step} Assessment</h4>
                        <p className="text-sm text-muted-foreground">
                          {session.endTime ? 
                            new Date(session.endTime).toLocaleDateString() : 
                            'In Progress'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary">
                          {session.score}%
                        </div>
                        {session.certificationLevel && (
                          <Badge variant="secondary" className="text-xs">
                            {session.certificationLevel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}

                  {userSessions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No assessments taken yet</p>
                      <Button variant="outline" className="mt-4" asChild>
                        <div className="cursor-pointer" onClick={() => navigate('/quiz')}>
                          Start Your First Assessment
                        </div>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round((completedSteps.length / 3) * 100)}%</span>
                    </div>
                    <Progress value={(completedSteps.length / 3) * 100} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Score Trend</span>
                      <span className="text-success">+12% this month</span>
                    </div>
                    <Progress value={75} />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Recommendations</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {nextStep && (
                        <p>• Continue with Step {nextStep} to advance your certification</p>
                      )}
                      <p>• Review weak areas in digital communication</p>
                      <p>• Practice more data analysis questions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {nextStep && (
                <Button variant="hero" size="lg" asChild>
                  <div className="cursor-pointer" onClick={() => navigate('/quiz')}>
                    <Play className="h-5 w-5 mr-2" />
                    Continue Assessment
                  </div>
                </Button>
              )}
              
              <Button variant="outline" size="lg">
                <Download className="h-5 w-5 mr-2" />
                Download Certificate
              </Button>
            </div>
          </div>
        </div>
      </div>
   
};

export default DashboardPage;