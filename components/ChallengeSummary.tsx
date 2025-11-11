import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ChallengeSummaryProps {
  score: { correct: number; total: number };
  onRestart: () => void;
  onBackToMenu: () => void;
}

const ChallengeSummary: React.FC<ChallengeSummaryProps> = ({ score, onRestart, onBackToMenu }) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  let feedbackMessage = '';
  if (percentage === 100) {
    feedbackMessage = "Перфектно! Вие сте експерт по кибер хигиена!";
  } else if (percentage >= 80) {
    feedbackMessage = "Отличен резултат! Имате много добри познания.";
  } else if (percentage >= 50) {
    feedbackMessage = "Добър опит! Има още какво да научите, но се справяте добре.";
  } else {
    feedbackMessage = "Продължавайте да опитвате! Всяка грешка е възможност за учене.";
  }

  const downloadPdf = () => {
    const input = summaryRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2, backgroundColor: '#1e293b' }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('cyber-hygiene-summary.pdf');
    });
  };

  return (
    <div className="w-full max-w-2xl text-center animate-fade-in">
        <div ref={summaryRef} className="bg-slate-800 rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-cyan-300 mb-2">Предизвикателството завърши!</h2>
            <p className="text-slate-300 mb-6">Ето вашето представяне:</p>

            <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="text-slate-700"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className="text-cyan-400"
                        strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                </svg>
                <div className="absolute text-center">
                     <span className="text-4xl font-bold text-white">{percentage}%</span>
                     <p className="text-slate-300">верни отговори</p>
                </div>
            </div>
            
            <p className="text-2xl font-semibold text-white mb-2">{score.correct} от {score.total}</p>
            <p className="text-lg text-cyan-400 italic mb-8">{feedbackMessage}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
                onClick={onRestart}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
                Нова игра
            </button>
            <button
                onClick={downloadPdf}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
                Изтегли PDF
            </button>
             <button
                onClick={onBackToMenu}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
                Главно меню
            </button>
        </div>
    </div>
  );
};

export default ChallengeSummary;