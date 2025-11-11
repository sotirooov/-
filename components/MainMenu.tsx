import React from 'react';
import { ChallengeCategory } from '../types';

interface MainMenuProps {
  onStartChallenge: (category: ChallengeCategory) => void;
}

const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const HomeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);

const BriefcaseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.396-2.158 2.396H5.908c-1.194 0-2.158-1.083-2.158-2.396V14.15M16.5 18.75h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 8.25V6.108c0-1.135-.845-2.098-1.976-2.098H7.976C6.845 4.01 6 4.973 6 6.108v2.142m12 0-2.097-1.398a2.25 2.25 0 0 0-2.158 0L12 8.25l-1.745-1.164a2.25 2.25 0 0 0-2.158 0L6 8.25m12 0v1.875a2.25 2.25 0 0 1-2.25 2.25H8.25A2.25 2.25 0 0 1 6 10.125V8.25" />
    </svg>
);

const NewspaperIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M12 7.5V18a2.25 2.25 0 0 0 2.25 2.25M7.5 15h3.375c.621 0 1.125-.504 1.125-1.125V7.5A2.25 2.25 0 0 0 9.75 5.25h-4.5A2.25 2.25 0 0 0 3 7.5v10.5A2.25 2.25 0 0 0 5.25 20.25h3.375c.621 0 1.125-.504 1.125-1.125V15Z" />
    </svg>
);


interface ChallengeCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    color: 'cyan' | 'blue' | 'indigo' | 'purple';
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ icon, title, description, onClick, color }) => {
    const colorClasses = {
        cyan: 'border-cyan-500 shadow-cyan-500/20 text-cyan-400',
        blue: 'border-blue-500 shadow-blue-500/20 text-blue-400',
        indigo: 'border-indigo-500 shadow-indigo-500/20 text-indigo-400',
        purple: 'border-purple-500 shadow-purple-500/20 text-purple-400',
    };
    
    return (
         <div 
            onClick={onClick}
            className={`bg-slate-800 border-2 ${colorClasses[color]} rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-lg`}
        >
            <div className="flex items-center mb-4">
                <div className="w-8 h-8 mr-4">{icon}</div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <p className="text-slate-300">{description}</p>
        </div>
    );
};


const MainMenu: React.FC<MainMenuProps> = ({ onStartChallenge }) => {
  return (
    <div className="w-full max-w-md space-y-6">
        <ChallengeCard
            onClick={() => onStartChallenge('phishing')}
            icon={<SparklesIcon />}
            title="Фишинг предизвикателство"
            description="Генерирайте безкрайни, реалистични фишинг сценарии с помощта на AI. Всеки рунд е уникален!"
            color="cyan"
        />
        <ChallengeCard
            onClick={() => onStartChallenge('daily')}
            icon={<HomeIcon />}
            title="Ежедневна кибер хигиена"
            description="Тествайте знанията си за киберсигурност в ежедневни ситуации като социални мрежи и онлайн пазаруване."
            color="blue"
        />
        <ChallengeCard
            onClick={() => onStartChallenge('work')}
            icon={<BriefcaseIcon />}
            title="Кибер хигиена на работното място"
            description="Научете как да предпазвате фирмената информация и да разпознавате заплахи в корпоративна среда."
            color="indigo"
        />
        <ChallengeCard
            onClick={() => onStartChallenge('fake_news')}
            icon={<NewspaperIcon />}
            title="Разпознаване на фалшиви новини"
            description="Тренирайте критичното си мислене и се научете да идентифицирате дезинформация и подвеждащи заглавия."
            color="purple"
        />
    </div>
  );
};

export default MainMenu;