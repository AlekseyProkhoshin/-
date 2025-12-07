import React, { useState, useCallback } from 'react';
import { Question } from './types';
import { QUIZ_DATA } from './constants';
import { shuffleArray } from './utils';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';

type ScreenState = 'start' | 'quiz' | 'result';

export interface UserInfo {
  name: string;
  group: string;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // State for user identification
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', group: '' });

  // State for the current question interaction
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Initialize and shuffle questions when starting
  const startQuiz = useCallback((user: UserInfo) => {
    setUserInfo(user);

    // Deep copy to avoid mutating the constant
    const deepCopiedQuestions = JSON.parse(JSON.stringify(QUIZ_DATA.questions));
    
    // Shuffle options for each question
    const processedQuestions = deepCopiedQuestions.map((q: Question) => ({
      ...q,
      answerOptions: shuffleArray([...q.answerOptions])
    }));

    setQuestions(shuffleArray(processedQuestions));

    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScreen('quiz');
  }, []);

  const handleRestart = useCallback(() => {
    setScreen('start');
    setUserInfo({ name: '', group: '' });
  }, []);

  const handleOptionSelect = useCallback((index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(index);
    }
  }, [isAnswerSubmitted]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.answerOptions[selectedOption].isCorrect) {
      setScore(prev => prev + 1);
    }
  }, [questions, currentQuestionIndex, selectedOption, isAnswerSubmitted]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setScreen('result');
    }
  }, [currentQuestionIndex, questions.length]);

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      {screen === 'start' && (
        <StartScreen title={QUIZ_DATA.title} onStart={startQuiz} />
      )}

      {screen === 'quiz' && questions.length > 0 && (
        <QuizScreen
          question={questions[currentQuestionIndex]}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          selectedOption={selectedOption}
          isAnswerSubmitted={isAnswerSubmitted}
          onOptionSelect={handleOptionSelect}
          onSubmit={handleSubmitAnswer}
          onNext={handleNextQuestion}
        />
      )}

      {screen === 'result' && (
        <ResultScreen 
          score={score} 
          totalQuestions={questions.length} 
          userInfo={userInfo}
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}