import React from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, AlertCircle, Lightbulb, ArrowRight, Check } from 'lucide-react';

interface QuizScreenProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  isAnswerSubmitted: boolean;
  onOptionSelect: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedOption,
  isAnswerSubmitted,
  onOptionSelect,
  onSubmit,
  onNext
}) => {
  const progressPercent = ((currentQuestionIndex) / totalQuestions) * 100;

  return (
    <div className="flex flex-col h-full fade-in">
      {/* Header */}
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-2 text-sm font-medium text-slate-500">
          <span>Вопрос {currentQuestionIndex + 1} из {totalQuestions}</span>
          <span>{Math.round(progressPercent)}% завершено</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-grow">
        <h2 className="text-xl font-bold mb-6 text-slate-800 leading-snug">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.answerOptions.map((option, index) => {
            // Determine styling based on state
            let containerClass = "w-full text-left p-4 rounded-xl border-2 flex items-start relative transition-all duration-200 ";
            let icon = null;

            if (!isAnswerSubmitted) {
              if (selectedOption === index) {
                containerClass += "border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md transform -translate-y-0.5";
                icon = <div className="w-6 h-6 rounded-full border-2 border-blue-500 mr-4 flex-shrink-0 flex items-center justify-center"><div className="w-3 h-3 bg-blue-500 rounded-full"></div></div>;
              } else {
                containerClass += "border-slate-200 hover:border-blue-300 hover:bg-slate-50 hover:shadow-sm";
                icon = <div className="w-6 h-6 rounded-full border-2 border-slate-300 mr-4 flex-shrink-0 group-hover:border-blue-400 transition-colors"></div>;
              }
            } else {
              // Result state
              if (option.isCorrect) {
                containerClass += "border-green-500 bg-green-50 text-green-900";
                icon = <div className="w-6 h-6 rounded-full bg-green-500 mr-4 flex-shrink-0 flex items-center justify-center text-white"><Check size={14} strokeWidth={3} /></div>;
              } else if (selectedOption === index && !option.isCorrect) {
                containerClass += "border-red-500 bg-red-50 text-red-900";
                icon = <div className="w-6 h-6 rounded-full bg-red-500 mr-4 flex-shrink-0 flex items-center justify-center text-white"><XCircle size={14} strokeWidth={3} /></div>;
              } else {
                containerClass += "border-slate-100 text-slate-400 opacity-60 cursor-not-allowed";
                icon = <div className="w-6 h-6 rounded-full border-2 border-slate-200 mr-4 flex-shrink-0"></div>;
              }
            }

            return (
              <button
                key={index}
                onClick={() => onOptionSelect(index)}
                disabled={isAnswerSubmitted}
                className={containerClass}
              >
                {icon}
                <span className="text-base font-medium leading-relaxed">{option.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {isAnswerSubmitted ? (
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-100 fade-in">
             {selectedOption !== null && question.answerOptions[selectedOption].isCorrect ? (
                <div className="flex items-center text-green-700 font-bold mb-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Отлично!
                </div>
             ) : (
                <div className="flex items-center text-red-600 font-bold mb-2">
                   <AlertCircle className="w-5 h-5 mr-2" />
                   Обратите внимание
                </div>
             )}
             
             <p className="text-slate-700 leading-relaxed">
               {selectedOption !== null && question.answerOptions[selectedOption].rationale}
             </p>

             {/* If wrong, explicitly show correct rationale again if needed, but the design shows the selected option rationale. 
                 The prompt's design showed the user's selected rationale. 
                 If user was wrong, it added "Correct answer is..." */}
             {selectedOption !== null && !question.answerOptions[selectedOption].isCorrect && (
               <div className="mt-3 pt-3 border-t border-blue-200 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">Правильный ответ: </span>
                  {question.answerOptions.find(o => o.isCorrect)?.text}
                  <div className="mt-1 text-slate-500">
                    {question.answerOptions.find(o => o.isCorrect)?.rationale}
                  </div>
               </div>
             )}
          </div>
        ) : (
          <div className="mt-6 flex items-start text-sm text-slate-500 italic bg-slate-50 p-3 rounded-lg">
            <Lightbulb className="w-5 h-5 mr-2 flex-shrink-0 text-yellow-500" />
            <span>Подсказка: {question.hint}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
        {!isAnswerSubmitted ? (
          <button
            onClick={onSubmit}
            disabled={selectedOption === null}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              selectedOption !== null 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Ответить
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Завершить тест' : 'Следующий вопрос'}
            <ArrowRight size={18} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};