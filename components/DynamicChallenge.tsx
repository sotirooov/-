import React, { useState, useEffect, useCallback } from 'react';
import { generateScenario, generateFeedback } from '../services/geminiService';
import { Scenario, ChallengeCategory, BodySegment } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ScenarioDisplay from './ScenarioDisplay';
import FeedbackDisplay from './FeedbackDisplay';
import ChallengeSummary from './ChallengeSummary';

interface DynamicChallengeProps {
    category: ChallengeCategory;
    onBackToMenu: () => void;
}

const CHALLENGE_LENGTH = 15;

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
    </svg>
);

const DynamicChallenge: React.FC<DynamicChallengeProps> = ({ category, onBackToMenu }) => {
  const [gameState, setGameState] = useState<'playing' | 'summary'>('playing');
  const [isLoadingScenario, setIsLoadingScenario] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  const fetchNewScenario = useCallback(() => {
    if (score.total >= CHALLENGE_LENGTH) {
      setGameState('summary');
      return;
    }
    
    setIsLoadingScenario(true);
    setError(null);
    setScenario(null);
    setUserAnswer(null);
    setFeedback(null);
    setSelectedAnswers([]);
    setLastAnswerCorrect(false);

    generateScenario(category)
      .then(setScenario)
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Възникна непозната грешка.");
        }
      })
      .finally(() => setIsLoadingScenario(false));
  }, [category, score.total]);

  useEffect(() => {
    fetchNewScenario();
  }, [fetchNewScenario]);

  const handleAnswer = async (answer: string, isCorrect: boolean) => {
    if (!scenario) return;
    setUserAnswer(answer);
    setLastAnswerCorrect(isCorrect);
    
    setScore(s => ({
        total: s.total + 1,
        correct: isCorrect ? s.correct + 1 : s.correct,
    }));

    setIsLoadingFeedback(true);
    setError(null);
    try {
      const feedbackText = await generateFeedback(scenario, answer);
      setFeedback(feedbackText);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Грешка при получаване на обратна връзка.");
      }
    } finally {
      setIsLoadingFeedback(false);
    }
  };
  
  const handleCheckboxChange = (option: string) => {
    if (userAnswer !== null) return;
    setSelectedAnswers(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleMultipleSelectSubmit = () => {
      if (!scenario || !scenario.correctAnswers) return;
      const correctSet = new Set(scenario.correctAnswers);
      const selectedSet = new Set(selectedAnswers);
      const isCorrect = correctSet.size === selectedSet.size && [...correctSet].every(item => selectedSet.has(item));
      handleAnswer(selectedAnswers.join(', '), isCorrect);
  };

  const handleRestart = () => {
    setScore({ correct: 0, total: 0 });
    setGameState('playing');
    fetchNewScenario();
  };
  
  if (gameState === 'summary') {
    return (
        <ChallengeSummary 
            score={score}
            onRestart={handleRestart}
            onBackToMenu={onBackToMenu}
        />
    )
  }

  if (isLoadingScenario) {
    return <LoadingSpinner text={`Генериране на задача ${score.total + 1}/${CHALLENGE_LENGTH}...`} />;
  }

  if (error && !scenario) {
    return (
      <div className="text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchNewScenario} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
          Опитай отново
        </button>
      </div>
    );
  }

  if (!scenario) {
    return <div className="text-center text-slate-400">Няма наличен сценарий.</div>;
  }
  
  const isAnswered = userAnswer !== null;
  const isInteractive = scenario.questionType === 'identify_element';
  const isMultipleSelect = scenario.questionType === 'multiple_select';
  const isStandardChoice = !isInteractive && !isMultipleSelect;

  return (
    <>
        <div className="w-full max-w-2xl bg-slate-800 rounded-lg shadow-lg p-6 sm:p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold text-slate-300">
                    Задача: <span className="text-cyan-400">{score.total + 1} / {CHALLENGE_LENGTH}</span>
                </div>
                <div className="text-lg font-bold text-slate-300">
                    Резултат: <span className="text-cyan-400">{score.correct} / {score.total}</span>
                </div>
            </div>
            <ScenarioDisplay 
              scenario={scenario} 
              onSegmentClick={(segment) => handleAnswer(segment.text, !!segment.isCorrectPart)}
              disabled={isAnswered}
              userAnswer={userAnswer}
            />
            
            {isStandardChoice && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scenario.options.map((option) => {
                        const isSelected = userAnswer === option;
                        const isCorrect = scenario.correctAnswer === option;
                        let buttonClass = 'w-full text-lg font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out transform disabled:cursor-not-allowed';
                        if (isAnswered) {
                            if (isCorrect) buttonClass += ' bg-green-600 ring-4 ring-green-500/50 text-white';
                            else if (isSelected) buttonClass += ' bg-red-600 ring-4 ring-red-500/50 text-white';
                            else buttonClass += ' bg-slate-700 text-slate-400 opacity-70';
                        } else buttonClass += ' bg-slate-700 text-white hover:bg-slate-600 focus:ring-4 focus:ring-cyan-500/50';
                        return ( <button key={option} onClick={() => handleAnswer(option, isCorrect)} disabled={isAnswered} className={buttonClass}>{option}</button> )
                    })}
                </div>
            )}

            {isMultipleSelect && (
                 <div className="mt-8 space-y-3">
                    {scenario.options.map((option) => {
                        const isSelected = selectedAnswers.includes(option);
                        const isCorrect = scenario.correctAnswers?.includes(option);
                        let optionClass = 'w-full text-left p-4 rounded-lg transition-colors duration-200 flex items-center border';

                        if (isAnswered) {
                            if (isCorrect && isSelected) optionClass += ' bg-green-500/20 border-green-500 text-slate-100';
                            else if (isCorrect && !isSelected) optionClass += ' bg-slate-700 border-blue-500 text-slate-100';
                            else if (!isCorrect && isSelected) optionClass += ' bg-red-500/20 border-red-500 text-slate-400 line-through';
                            else optionClass += ' bg-slate-800 border-slate-700 text-slate-400 opacity-70';
                        } else {
                            optionClass += ` bg-slate-700 border-slate-600 cursor-pointer ${isSelected ? 'ring-2 ring-cyan-400' : 'hover:bg-slate-600'}`;
                        }

                        return (
                            <div key={option} className={optionClass} onClick={() => handleCheckboxChange(option)}>
                                <div className={`w-6 h-6 rounded mr-4 flex-shrink-0 border-2 flex items-center justify-center ${isSelected ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-500'}`}>
                                    {isSelected && <CheckIcon />}
                                </div>
                                <span>{option}</span>
                            </div>
                        );
                    })}
                    {!isAnswered && (
                        <button onClick={handleMultipleSelectSubmit} disabled={selectedAnswers.length === 0} className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                            Потвърди
                        </button>
                    )}
                </div>
            )}


            {isAnswered && isLoadingFeedback && ( <div className="mt-6"><LoadingSpinner text="AI генерира обяснение..." small /></div> )}
            
            {isAnswered && !isLoadingFeedback && error && (
                <div className="mt-6 text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={fetchNewScenario} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                        {score.total >= CHALLENGE_LENGTH ? 'Виж резултатите' : 'Продължи'}
                    </button>
                </div>
            )}
        </div>

        {isAnswered && !isLoadingFeedback && feedback && (
            <FeedbackDisplay 
                feedback={feedback}
                isCorrect={lastAnswerCorrect}
                onClose={fetchNewScenario}
                isLastQuestion={score.total >= CHALLENGE_LENGTH}
            />
        )}
    </>
  );
};

export default DynamicChallenge;