import React from 'react';

interface FeedbackDisplayProps {
  feedback: string;
  isCorrect: boolean;
  onClose: () => void;
  isLastQuestion: boolean;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, isCorrect, onClose, isLastQuestion }) => {
  const title = isCorrect ? 'Правилно!' : 'Грешно!';
  const titleColor = isCorrect ? 'text-green-400' : 'text-red-400';
  const borderColor = isCorrect ? 'border-green-500' : 'border-red-500';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className={`bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md border-t-4 ${borderColor}`}>
        <h3 className={`text-2xl font-bold text-center mb-4 ${titleColor}`}>{title}</h3>
        <p className="text-slate-300 text-center mb-6">{feedback}</p>
        <button
          onClick={onClose}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isLastQuestion ? 'Виж резултатите' : 'Продължи'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackDisplay;