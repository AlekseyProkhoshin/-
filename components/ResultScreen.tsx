import React, { useState } from 'react';
import { RotateCcw, Trophy, AlertTriangle, CheckCircle2, Mail, Copy, Check } from 'lucide-react';
import { UserInfo } from '../App';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  userInfo: UserInfo;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, userInfo, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const [copied, setCopied] = useState(false);
  
  let message = '';
  let colorClass = '';
  let Icon = Trophy;

  if (percentage >= 85) {
    message = 'Отличный результат! Вы допущены к практическому этапу.';
    colorClass = 'text-green-600';
    Icon = Trophy;
  } else if (percentage >= 60) {
    message = 'Неплохо, но есть пробелы. Рекомендуется повторить материал.';
    colorClass = 'text-yellow-600';
    Icon = CheckCircle2;
  } else {
    message = 'Тест не сдан. Необходимо повторное обучение.';
    colorClass = 'text-red-600';
    Icon = AlertTriangle;
  }

  // Ring color logic
  const ringColor = percentage >= 85 ? 'border-green-500' : percentage >= 60 ? 'border-yellow-500' : 'border-red-500';

  // Format the report text
  const getReportText = () => {
    return `РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ (СОП ТюмГУ)
--------------------------------
Студент: ${userInfo.name}
Группа: ${userInfo.group}
Дата: ${new Date().toLocaleDateString()}
--------------------------------
Результат: ${score} из ${totalQuestions} (${percentage}%)
Статус: ${percentage >= 60 ? 'СДАНО' : 'НЕ СДАНО'}
--------------------------------`;
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Результаты теста: ${userInfo.name} (${userInfo.group})`);
    const body = encodeURIComponent(getReportText() + "\n\n");
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getReportText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="p-8 text-center fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Результаты тестирования</h2>
      <p className="text-slate-500 mb-6">
        {userInfo.name}, гр. {userInfo.group}
      </p>
      
      <div className="mb-8 relative inline-block">
         <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-8 ${ringColor} flex items-center justify-center bg-white shadow-inner mx-auto transition-colors duration-500`}>
            <div className="text-center">
                <span className={`text-4xl md:text-5xl font-bold ${colorClass}`}>{percentage}%</span>
            </div>
         </div>
         <div className={`absolute -bottom-2 -right-2 bg-white rounded-full p-2 border shadow-sm ${colorClass}`}>
             <Icon size={28} />
         </div>
      </div>

      <div className={`bg-slate-50 p-4 md:p-6 rounded-xl mb-6 border border-slate-200 ${percentage < 60 ? 'bg-red-50 border-red-100' : ''}`}>
        <p className={`text-lg font-semibold ${colorClass}`}>
            {message}
        </p>
        <p className="text-slate-600 mt-2">
          Правильных ответов: <span className="font-bold">{score}</span> из {totalQuestions}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-lg mx-auto">
        <button 
          onClick={handleSendEmail}
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium shadow-sm"
        >
          <Mail size={18} className="mr-2" />
          Отправить преподавателю
        </button>
        
        <button 
          onClick={handleCopy}
          className={`flex items-center justify-center border px-4 py-3 rounded-lg transition-all font-medium shadow-sm
            ${copied 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
        >
          {copied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
          {copied ? 'Скопировано!' : 'Скопировать результат'}
        </button>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <button 
          onClick={onRestart} 
          className="inline-flex items-center text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors"
        >
          <RotateCcw size={16} className="mr-2" />
          Пройти тест заново
        </button>
      </div>
    </div>
  );
};