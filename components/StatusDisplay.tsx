
import React from 'react';
import { LoadingState, Session } from '../types';

interface StatusDisplayProps {
  loadingState: LoadingState;
  activeSession: Session | null;
  error: string | null;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ loadingState, activeSession, error }) => {
  const getStatusContent = () => {
    switch (loadingState) {
      case LoadingState.LISTENING:
        return {
          title: "Listening...",
          message: "Speak your idea clearly. We're all ears!",
          bg: "bg-blue-900/50",
          border: "border-blue-500",
        };
      case LoadingState.PROCESSING:
        return {
          title: "Processing...",
          message: "Understanding your words and expanding the creative vision.",
          bg: "bg-purple-900/50",
          border: "border-purple-500",
        };
      case LoadingState.GENERATING:
        return {
          title: "Generating Image...",
          message: "The AI is now sketching your masterpiece. This can take a moment.",
          bg: "bg-purple-900/50",
          border: "border-purple-500",
        };
      case LoadingState.ERROR:
        return {
          title: "An Error Occurred",
          message: error || "Something went wrong. Please try again.",
          bg: "bg-red-900/50",
          border: "border-red-500",
        };
      case LoadingState.SUCCESS:
        return {
            title: "Success!",
            message: "Your vision has been brought to life. Start a new sketch when you're ready.",
            bg: "bg-green-900/50",
            border: "border-green-500",
          };
      case LoadingState.IDLE:
      default:
        if (activeSession) {
            return {
                title: "Viewing Sketch",
                message: "This is a previously generated creation. Start a new one anytime.",
                bg: "bg-gray-800/50",
                border: "border-gray-700",
            }
        }
        return {
          title: "Ready to Create",
          message: "Use the microphone or text box to describe the image you want to create.",
          bg: "bg-gray-800/50",
          border: "border-gray-700",
        };
    }
  };

  const { title, message, bg, border } = getStatusContent();

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${bg} ${border}`}>
      <h2 className="font-bold text-xl">{title}</h2>
      <p className="text-gray-400 text-sm mt-1">{message}</p>
    </div>
  );
};

export default StatusDisplay;
