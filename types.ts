export interface AnswerOption {
    text: string;
    rationale: string;
    isCorrect: boolean;
  }
  
  export interface Question {
    questionNumber: number;
    question: string;
    answerOptions: AnswerOption[];
    hint: string;
  }
  
  export interface QuizData {
    title: string;
    questions: Question[];
  }