import React from 'react';
import { Scenario, BodySegment } from '../types';

interface ScenarioDisplayProps {
  scenario: Scenario;
  onSegmentClick: (segment: BodySegment) => void;
  disabled: boolean;
  userAnswer: string | null;
}

const ScenarioDisplay: React.FC<ScenarioDisplayProps> = ({ scenario, onSegmentClick, disabled, userAnswer }) => {
  const isInteractive = scenario.questionType === 'identify_element';
  
  return (
    <div className="bg-slate-900/50 rounded-lg p-4 sm:p-6 border border-slate-700">
      {(scenario.sender || scenario.subject) && (
        <div className="mb-4 pb-2 border-b border-slate-700">
          {scenario.sender && (
            <p className="text-sm text-slate-400">
              <span className="font-semibold">От:</span> {scenario.sender}
            </p>
          )}
          {scenario.subject && (
            <p className="text-sm text-slate-400 mt-1">
              <span className="font-semibold">Тема:</span> {scenario.subject}
            </p>
          )}
        </div>
      )}
      <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
        {Array.isArray(scenario.body) ? (
          scenario.body.map((segment, index) => {
            const isSelected = userAnswer === segment.text;
            let segmentClass = "";

            if (disabled) {
              if (segment.isCorrectPart) {
                segmentClass = "bg-green-500/30 text-green-300 px-1 py-0.5 rounded";
              } else if (isSelected) {
                segmentClass = "bg-red-500/30 text-red-300 px-1 py-0.5 rounded";
              }
            } else if (isInteractive) {
                segmentClass = "cursor-pointer hover:bg-cyan-500/20 px-1 py-0.5 rounded transition-colors duration-200"
            }

            return (
              <span
                key={index}
                className={segmentClass}
                onClick={() => !disabled && isInteractive && onSegmentClick(segment)}
              >
                {segment.text}
              </span>
            )
          })
        ) : (
          scenario.body
        )}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-700">
        <p className="font-bold text-lg text-cyan-300">{scenario.question}</p>
      </div>
    </div>
  );
};

export default ScenarioDisplay;