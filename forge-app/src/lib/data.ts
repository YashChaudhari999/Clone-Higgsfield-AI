import { Model } from './types';

export const MODELS: Model[] = [
  {
    id: 'forge-video-2',
    name: 'Forge Video 2',
    description: 'Flagship cinematic video generation. Best quality, highest fidelity.',
    type: ['video'],
    badge: 'Flagship',
  },
  {
    id: 'forge-video-1',
    name: 'Forge Video 1',
    description: 'Fast video generation with excellent motion quality.',
    type: ['video'],
  },
  {
    id: 'forge-motion',
    name: 'Forge Motion',
    description: 'Specialized for camera movements and cinematic effects.',
    type: ['video'],
    badge: 'New',
  },
  {
    id: 'forge-image-2',
    name: 'Forge Image 2',
    description: 'Photorealistic image generation with stunning detail.',
    type: ['image'],
    badge: 'Flagship',
  },
  {
    id: 'forge-image-1',
    name: 'Forge Image 1',
    description: 'Fast, high-quality image generation for rapid iteration.',
    type: ['image'],
  },
  {
    id: 'forge-art',
    name: 'Forge Art',
    description: 'Artistic styles, illustrations, and creative visual expression.',
    type: ['image'],
    badge: 'New',
  },
];

export const DEMO_PROMPTS = [
  'Cinematic drone shot soaring over a neon-lit cyberpunk city at dusk',
  'A lone astronaut walks across the surface of Mars, dust storms swirling',
  'Slow motion waves crashing on a black sand beach, golden hour light',
  'Inside a cathedral of ancient trees, shafts of light pierce the canopy',
  'A vintage sports car drifts through mountain roads in misty rain',
  'Underwater city ruins, bioluminescent creatures drifting through coral',
  'Time-lapse of storm clouds forming over a vast wheat field at twilight',
  'Close-up of a hummingbird hovering, iridescent feathers in macro detail',
];

export const FEATURE_HIGHLIGHTS = [
  {
    icon: 'Zap',
    title: 'Real-time Generation',
    description: 'Go from prompt to polished output in seconds with our optimized inference pipeline.',
  },
  {
    icon: 'Layers',
    title: 'Multi-model Studio',
    description: 'Switch between video, image, and motion models in one unified workspace.',
  },
  {
    icon: 'Sparkles',
    title: 'Cinematic Quality',
    description: 'Every output meets professional standards. No blurry results, no artifacts.',
  },
  {
    icon: 'History',
    title: 'Full Creation History',
    description: 'Every generation is saved. Revisit, remix, and build on your best work.',
  },
];
