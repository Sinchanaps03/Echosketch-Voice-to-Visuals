
export interface Session {
  id: string;
  originalTranscript: string;
  enhancedPrompt: string;
  imageUrl: string;
  createdAt: string;
}

export enum LoadingState {
  IDLE = 'idle',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  GENERATING = 'generating',
  SUCCESS = 'success',
  ERROR = 'error',
}
