import React, { useState, useEffect, useCallback } from 'react';
import { Session, LoadingState } from './types';
import { enhancePrompt, generateImage } from './services/geminiService';
import SessionSidebar from './components/SessionSidebar';
import ImageDisplay from './components/ImageDisplay';
import Header from './components/Header';
import TextInput from './components/TextInput';
import StatusDisplay from './components/StatusDisplay';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem('echosketch-sessions');
      if (storedSessions) {
        const parsedSessions: Session[] = JSON.parse(storedSessions);
        setSessions(parsedSessions);
        if (parsedSessions.length > 0) {
            setActiveSession(parsedSessions[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load sessions from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('echosketch-sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to save sessions to localStorage", e);
    }
  }, [sessions]);

  const createNewSession = () => {
    setActiveSession(null);
    setLoadingState(LoadingState.IDLE);
    setError(null);
  };
  
  const processTranscript = useCallback(async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setError(null);
    setLoadingState(LoadingState.PROCESSING);

    // Create a temporary session to show transcript immediately
    const tempSession: Session = {
        id: `temp-${Date.now()}`,
        originalTranscript: transcript,
        enhancedPrompt: 'Enhancing your idea...',
        imageUrl: '',
        createdAt: new Date().toISOString(),
    };
    setActiveSession(tempSession);
    
    try {
      const enhanced = await enhancePrompt(transcript);
      setActiveSession(prev => prev ? { ...prev, enhancedPrompt: enhanced } : null);

      setLoadingState(LoadingState.GENERATING);
      const imageUrl = await generateImage(enhanced);
      setLoadingState(LoadingState.SUCCESS);

      const newSession: Session = {
        id: crypto.randomUUID(),
        originalTranscript: transcript,
        enhancedPrompt: enhanced,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      };

      setActiveSession(newSession);
      setSessions(prevSessions => [newSession, ...prevSessions]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setLoadingState(LoadingState.ERROR);
      // Remove temporary session on error if it's still active
      setActiveSession(prev => prev?.id.startsWith('temp-') ? null : prev);
    }
  }, []);

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      setError(null);
      setLoadingState(LoadingState.IDLE);
    }
  };

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-gray-100">
      <SessionSidebar 
        sessions={sessions}
        activeSessionId={activeSession?.id}
        onSelectSession={handleSelectSession}
        onNewSession={createNewSession}
      />

      <main className="flex-1 flex flex-col relative" key={activeSession ? activeSession.id : 'new'}>
        <Header />

        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col justify-center">
              <ImageDisplay 
                imageUrl={activeSession?.imageUrl}
                isLoading={loadingState === LoadingState.GENERATING}
                prompt={activeSession?.enhancedPrompt}
              />
            </div>
            <div className="flex-1 flex flex-col gap-4 max-w-lg mx-auto lg:mx-0">
               <StatusDisplay
                loadingState={loadingState}
                activeSession={activeSession}
                error={error}
               />
               <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                 <h3 className="font-semibold text-lg text-blue-300">Your Transcript</h3>
                 <p className="text-gray-300 min-h-[4rem]">{activeSession?.originalTranscript || '...'}</p>
               </div>
               <div className="bg-gray-800 rounded-lg p-4">
                 <p className="font-semibold text-lg text-purple-300 min-h-[4rem]">{activeSession?.enhancedPrompt || '...'}</p>
               </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 p-4 w-full max-w-3xl">
           <TextInput 
              onSubmit={processTranscript} 
              onStateChange={setLoadingState}
              disabled={loadingState !== LoadingState.IDLE && loadingState !== LoadingState.LISTENING} 
            />
        </div>

      </main>
    </div>
  );
};

export default App;