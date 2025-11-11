import React, { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import DynamicChallenge from './components/DynamicChallenge';
import { ChallengeCategory } from './types';

type View = 'menu' | ChallengeCategory;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('menu');
  
  const startChallenge = useCallback((category: ChallengeCategory) => {
    setCurrentView(category);
  }, []);

  const backToMenu = useCallback(() => {
    setCurrentView('menu');
  }, []);

  const titles: Record<ChallengeCategory, string> = {
    phishing: 'Фишинг предизвикателство',
    daily: 'Ежедневна кибер хигиена',
    work: 'Кибер хигиена на работното място',
    fake_news: 'Разпознаване на фалшиви новини'
  };
  
  const challengeCategory = currentView !== 'menu' ? currentView : undefined;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Предизвикателство по кибер хигиена
        </h1>
        {challengeCategory && (
           <div className="mt-4">
            <h2 className="text-2xl font-semibold text-cyan-300">{titles[challengeCategory]}</h2>
            <button 
              onClick={backToMenu} 
              className="mt-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
            >
              &larr; Обратно към главното меню
            </button>
           </div>
        )}
      </header>
      <main className="w-full flex-grow flex items-center justify-center">
        {currentView === 'menu' ? (
            <MainMenu onStartChallenge={startChallenge} />
        ) : (
            <DynamicChallenge 
                key={currentView} // Add key to force re-mount and reset state on category change
                category={currentView}
                onBackToMenu={backToMenu} 
            />
        )}
      </main>
    </div>
  );
};

export default App;