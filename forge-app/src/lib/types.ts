export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';

export type CreationType = 'video' | 'image';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9';

export type Duration = '3s' | '5s' | '8s' | '10s';

export interface Model {
  id: string;
  name: string;
  description: string;
  type: CreationType[];
  badge?: string;
}

export interface Generation {
  id: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  modelId: string;
  type: CreationType;
  aspectRatio: AspectRatio;
  duration?: Duration;
  status: GenerationStatus;
  createdAt: string;
  completedAt?: string;
  resultUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'studio';
  creditsUsed: number;
  creditsTotal: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
