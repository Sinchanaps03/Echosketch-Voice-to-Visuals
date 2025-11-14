
import React from 'react';
import { Session } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { ImageIcon } from './icons/ImageIcon';

interface SessionSidebarProps {
  sessions: Session[];
  activeSessionId: string | null | undefined;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

const SessionSidebar: React.FC<SessionSidebarProps> = ({ sessions, activeSessionId, onSelectSession, onNewSession }) => {
  return (
    <aside className="w-64 bg-gray-950 flex flex-col border-r border-gray-800 h-full">
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 font-semibold"
        >
          <PlusIcon className="w-5 h-5" />
          New Sketch
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center text-gray-500 px-4 py-8">
              <ImageIcon className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Your creations will appear here.</p>
            </div>
          ) : (
            sessions.map((session) => (
              <a
                key={session.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectSession(session.id);
                }}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${
                  activeSessionId === session.id ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                }`}
              >
                <img
                  src={session.imageUrl}
                  alt="Session thumbnail"
                  className="w-10 h-10 rounded-md object-cover bg-gray-700 flex-shrink-0"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-gray-200 truncate">{session.enhancedPrompt}</p>
                  <p className="text-xs text-gray-500">{new Date(session.createdAt).toLocaleString()}</p>
                </div>
              </a>
            ))
          )}
        </nav>
      </div>
    </aside>
  );
};

export default SessionSidebar;
