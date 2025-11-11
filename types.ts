export type ChallengeCategory = 'phishing' | 'daily' | 'work' | 'fake_news';

export interface BodySegment {
  text: string;
  isCorrectPart?: boolean;
}

export interface Scenario {
  sender?: string;
  subject?: string;
  body: string | BodySegment[];
  question: string;
  questionType: 'binary' | 'multiple_choice' | 'identify_element' | 'multiple_select';
  options: string[];
  correctAnswer?: string; // For binary and multiple_choice
  correctAnswers?: string[]; // For multiple_select
}