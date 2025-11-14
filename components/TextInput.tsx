
import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { LoadingState } from '../types';

interface TextInputProps {
  onSubmit: (text: string) => void;
  onStateChange: (state: LoadingState) => void;
  disabled: boolean;
}

// Minimal interface for the non-standard SpeechRecognition API to satisfy TypeScript.
interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  start: () => void;
  stop: () => void;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSupported = !!SpeechRecognition;

const TextInput: React.FC<TextInputProps> = ({ onSubmit, onStateChange, disabled }) => {
  const [value, setValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop when user pauses.
    recognition.interimResults = true; // Get results as user speaks.
    recognition.lang = 'en-IN'; // Set language to Indian English.

    recognition.onstart = () => {
      setIsListening(true);
      onStateChange(LoadingState.LISTENING);
    };

    recognition.onend = () => {
      setIsListening(false);
      onStateChange(LoadingState.IDLE);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      onStateChange(LoadingState.ERROR);
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          onSubmit(transcript.trim());
          setValue('');
        } else {
          setValue(transcript);
        }
      }
    };
    
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onSubmit, onStateChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled && !isListening) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const toggleListening = () => {
    if (disabled && !isListening) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setValue('');
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="w-full space-y-2">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isListening ? "Listening..." : "Describe your vision..."}
          disabled={disabled && !isListening}
          readOnly={isListening}
          className="w-full bg-gray-800 border-2 border-gray-700 rounded-full py-3 pl-5 pr-24 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            type="button"
            onClick={toggleListening}
            disabled={!isSupported || disabled}
            title={isSupported ? 'Speak your prompt' : 'Speech recognition not supported'}
            className="p-2 rounded-full hover:bg-gray-700 disabled:hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MicrophoneIcon className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
          </button>
          <button
            type="submit"
            disabled={disabled || isListening || !value.trim()}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Submit prompt"
          >
            <PaperAirplaneIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
      {isListening && <p className="text-center text-sm text-gray-400">Listening... feel free to speak.</p>}
    </div>
  );
};

export default TextInput;
