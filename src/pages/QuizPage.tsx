import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/Layout';
import { RootState } from '@/store';
import { 
  startQuiz, 
  answerQuestion, 
  nextQuestion, 
  previousQuestion, 
  completeQuiz,
  setTimeRemaining,
  pauseTimer,
  resumeTimer
} from '@/store/slices/quizSlice';
import { getQuestionsForStep, calculateCertificationLevel, canProceedToNextStep } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const QuizPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { 
    currentSession, 
    currentQuestionIndex, 
    timeRemaining, 
    isTimerActive,
    availableSteps 
  } = useSelector((state: RootState) => state.quiz);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedStep, setSelectedStep] = useState<1 | 2 | 3>(1);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Timer effect
  useEffect(() => {
    if (currentSession && isTimerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        dispatch(setTimeRemaining(timeRemaining - 1));
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && currentSession) {
      handleCompleteQuiz();
    }
  }, [timeRemaining, isTimerActive, currentSession, dispatch]);

  const handleStartQuiz = (step: 1 | 2 | 3) => {
    const questions = getQuestionsForStep(step);
    const timeLimit = questions.length * 60; // 1 minute per question
    
    dispatch(startQuiz({ step, questions, timeLimit }));
    setSelectedAnswer(null);
    
    toast({
      title: "Quiz Started",
      description: `Step ${step} assessment has begun. Good luck!`,
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentSession) return;

    const currentQuestion = currentSession.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    dispatch(answerQuestion({
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent: 60 - (timeRemaining % 60)
    }));

    setSelectedAnswer(null);

    if (currentQuestionIndex < currentSession.questions.length - 1) {
      dispatch(nextQuestion());
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = () => {
    if (!currentSession) return;

    const correctAnswers = currentSession.answers.filter(a => a.isCorrect).length;
    const totalQuestions = currentSession.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    const certificationLevel = calculateCertificationLevel(score, currentSession.step);
    
    dispatch(completeQuiz({ 
      score, 
      certificationLevel: certificationLevel as any 
    }));

    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}%. ${certificationLevel ? `Certification: ${certificationLevel}` : 'Keep practicing!'}`,
      variant: score >= 25 ? "default" : "destructive"
    });

    // Show results
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return null;
  }

  // Quiz Selection Screen
  if (!currentSession) {
    return (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Digital Competency Assessment
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose your assessment step to begin the evaluation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((step) => {
                const isAvailable = availableSteps.includes(step);
                const stepInfo = {
                  1: { levels: 'A1 & A2', title: 'Foundation', description: 'Basic digital literacy skills' },
                  2: { levels: 'B1 & B2', title: 'Intermediate', description: 'Intermediate digital competencies' },
                  3: { levels: 'C1 & C2', title: 'Advanced', description: 'Advanced digital expertise' }
                }[step];

                return (
                  <Card 
                    key={step} 
                    className={`relative ${isAvailable ? 'cursor-pointer hover:shadow-card border-border/50 hover:border-primary/30' : 'opacity-50 cursor-not-allowed'} transition-smooth`}
                    onClick={() => isAvailable && setSelectedStep(step as 1 | 2 | 3)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                        {step}
                      </div>
                      <CardTitle className="text-xl">
                        Step {step}: {stepInfo?.title}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="secondary" className="mb-2">
                          {stepInfo?.levels}
                        </Badge>
                        <p>{stepInfo?.description}</p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2 text-sm text-muted-foreground mb-6">
                        <p>44 Questions</p>
                        <p>44 Minutes</p>
                        <p>Pass: 25% minimum</p>
                      </div>
                      
                      {isAvailable ? (
                        <Button 
                          variant={selectedStep === step ? "hero" : "outline"} 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartQuiz(step as 1 | 2 | 3);
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Assessment
                        </Button>
                      ) : (
                        <Button variant="outline" disabled className="w-full">
                          Complete Previous Step
                        </Button>
                      )}
                    </CardContent>
                    
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Quiz In Progress
  const currentQuestion = currentSession.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentSession.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === currentSession.questions.length - 1;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Header */}
          <div className="bg-card rounded-lg p-6 mb-8 shadow-card">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Step {currentSession.step} Assessment
                </h1>
                <p className="text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {currentSession.questions.length}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono text-lg">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(isTimerActive ? pauseTimer() : resumeTimer())}
                >
                  {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Progress value={progress} className="mt-4" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{currentQuestion.level}</Badge>
                <Badge variant="outline">{currentQuestion.competency}</Badge>
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                className="space-y-4"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer text-sm leading-relaxed"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => dispatch(previousQuestion())}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => dispatch(pauseTimer())}
              >
                Pause Quiz
              </Button>
              
              <Button
                variant={isLastQuestion ? "success" : "hero"}
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="gap-2"
              >
                {isLastQuestion ? (
                  <>
                    <Award className="h-4 w-4" />
                    Complete Quiz
                  </>
                ) : (
                  <>
                    Submit & Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default QuizPage;