import React, { useState } from 'react';
import { ClipboardList, PlayCircle, User, Users } from 'lucide-react';
import { UserInfo } from '../App';

interface StartScreenProps {
  title: string;
  onStart: (userInfo: UserInfo) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ title, onStart }) => {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState('');

  const handleStartClick = () => {
    if (!name.trim() || !group.trim()) {
      setError('Пожалуйста, заполните ФИО и номер группы перед началом.');
      return;
    }
    onStart({ name: name.trim(), group: group.trim() });
  };

  return (
    <div className="p-8 text-center fade-in">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600">
        <ClipboardList size={40} strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{title}</h1>
      <p className="text-slate-600 mb-8 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
        Вам предстоит ответить на 10 вопросов. <br />
        Введите свои данные, чтобы преподаватель мог идентифицировать результаты.
      </p>

      <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 text-left">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Данные студента</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Фамилия Имя</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Иванов Иван"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Номер группы</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users size={18} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                value={group}
                onChange={(e) => { setGroup(e.target.value); setError(''); }}
                placeholder="25Б-101"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
        
        {error && (
          <p className="mt-3 text-sm text-red-600 animate-pulse">
            {error}
          </p>
        )}
      </div>

      <button 
        onClick={handleStartClick} 
        className="group relative inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
      >
        <span className="mr-2">Начать тестирование</span>
        <PlayCircle size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};