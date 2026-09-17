// Centralized media and content data for Forgefield Explore Page

export interface MediaItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  badge?: string;
  image: string;
  videoUrl?: string;
  tag?: string;
  creator?: string;
  likes?: number;
  prompt?: string;
  model?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square' | 'tall';
}

export const MEDIA_DATA = {
  // Top Featured Banner / Cards
  featured: [
    {
      id: 'feat-1',
      title: 'FORGEFIELD API',
      subtitle: 'Build scalable video generation pipelines with sub-second API latency and enterprise SLA.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      badge: 'API ACCESS',
      ctaText: 'Explore API Docs',
      gradient: 'linear-gradient(180deg, rgba(11,13,14,0.2) 0%, rgba(11,13,14,0.95) 100%)',
    },
    {
      id: 'feat-2',
      title: 'FORGEFIELD GENJUTSU',
      subtitle: 'Transfer motion seamlessly into entirely new synthetic scenes with zero flickering.',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      badge: 'NEW MODEL',
      ctaText: 'Try Genjutsu',
      gradient: 'linear-gradient(180deg, rgba(11,13,14,0.2) 0%, rgba(11,13,14,0.95) 100%)',
    },
    {
      id: 'feat-3',
      title: 'AI MOTION DESIGNER 3.0',
      subtitle: 'Camera control presets, dynamic speed ramps, and temporal consistency at 60 FPS.',
      image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80',
      badge: 'POPULAR',
      ctaText: 'Launch Studio',
      gradient: 'linear-gradient(180deg, rgba(11,13,14,0.2) 0%, rgba(11,13,14,0.95) 100%)',
    }
  ],

  // Visual Effects Cards
  visualEffects: [
    {
      id: 'vfx-1',
      title: 'Floating Fall',
      category: 'Gravity Control',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      prompt: 'A person slow-motion falling through dark neon volumetric clouds, zero-G physics, hyper-detailed render',
      model: 'Forge VFX v2.4'
    },
    {
      id: 'vfx-2',
      title: 'High Flip',
      category: 'Acrobatic Motion',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      prompt: 'Dynamic parkour acrobatic flip over glowing cyberpunk skyscraper rooftops, motion blur, 8k cinematic',
      model: 'Seedance Pro 2.5'
    },
    {
      id: 'vfx-3',
      title: 'Burning Man',
      category: 'Elemental Fire',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      prompt: 'Silhouetted figure enveloped in intricate swirling magical embers and golden flame trails in desert at night',
      model: 'Forge VFX v2.4'
    },
    {
      id: 'vfx-4',
      title: 'Studio Slide',
      category: 'Camera Dynamics',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      prompt: 'Ultra-fast dolly zoom tracking shot following high-fashion model across wet mirror studio floor',
      model: 'Genjutsu Motion'
    },
    {
      id: 'vfx-5',
      title: 'Incline',
      category: 'Perspective Warp',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      prompt: 'Surreal angled mountain highway twisting into vertical sky orientation, inception style horizon shift',
      model: 'Wan 2.5'
    },
    {
      id: 'vfx-6',
      title: 'Act Natural',
      category: 'Character Motion',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      prompt: 'Photorealistic character subtle facial expressions, natural eye movement, micro-gestures, cinematic 85mm portrait',
      model: 'Forge Soul Pro'
    },
    {
      id: 'vfx-7',
      title: 'Eyes In',
      category: 'Macro Zoom',
      image: '/images/macro_eye_galaxy.png',
      prompt: 'Infinite macro zoom into pupil revealing reflection of exploding galaxy, prismatic light refractions',
      model: 'GPT Image 2'
    },
    {
      id: 'vfx-8',
      title: 'Street Colossus',
      category: 'Scale Distortion',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
      prompt: 'Towering giant mechanical titan walking between Tokyo neon skyscrapers during rainy dusk',
      model: 'Seedance 2.5'
    },
    {
      id: 'vfx-9',
      title: 'Melting',
      category: 'Fluid FX',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
      prompt: 'Liquid chrome sculpture melting and reforming into geometric crystal patterns with iridescent reflections',
      model: 'Forge VFX v2.4'
    },
    {
      id: 'vfx-10',
      title: 'Wild Ride',
      category: 'Speed & Drift',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      prompt: 'High-speed sports car drifting through neon wet tunnel, particle sparks flying from tires, anamorphic flare',
      model: 'Cinema Studio 2'
    },
    {
      id: 'vfx-11',
      title: 'Cutout',
      category: 'Paper Motion',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      prompt: 'Layered stop-motion papercraft collage coming to life with fluid dimensional depth',
      model: 'Banana Placement'
    },
    {
      id: 'vfx-12',
      title: 'World Morphing',
      category: 'Environment Swap',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      prompt: 'Seamless 360-degree environment transformation from snowy nordic forest into desert sand dunes',
      model: 'Genjutsu 2.0'
    },
    {
      id: 'vfx-13',
      title: 'Smash and Grab',
      category: 'Action FX',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      prompt: 'Kinetic glass shatter explosion in slow-motion, thousands of reflective shards floating in dark room',
      model: 'Forge VFX v2.4'
    },
    {
      id: 'vfx-14',
      title: 'Selfception',
      category: 'Cloning FX',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      prompt: 'Temporal time loop showing multiple instances of the same person interacting across a single room frame',
      model: 'Forge Soul Pro'
    },
    {
      id: 'vfx-15',
      title: 'Lacewalker',
      category: 'Surreal FX',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      prompt: 'Ethereal glowing lace patterns weaving across water surface as figure walks across liquid light',
      model: 'Seedance 2.5'
    }
  ],

  // Seedance 2.5 Section Editorial Grid
  seedanceGrid: [
    {
      id: 'sd-1',
      title: 'Cinematic Character Motion',
      subtitle: 'Photorealistic physics and fabric dynamics at 4K resolution',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      aspectRatio: 'tall', // Vertical dominant hero card
    },
    {
      id: 'sd-2',
      title: 'Hyper-detailed Environments',
      subtitle: 'Volumetric lighting & dense atmospheric particles',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'landscape',
    },
    {
      id: 'sd-3',
      title: 'Complex Camera Orbits',
      subtitle: 'Multi-axis camera tracking with temporal coherence',
      image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'landscape',
    },
    {
      id: 'sd-4',
      title: 'Synthetic Lighting Control',
      subtitle: 'Dynamic shadow maps and subsurface scattering',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'landscape',
    },
    {
      id: 'sd-5',
      title: 'High Speed Action Tracking',
      subtitle: 'Zero motion tear on rapid object velocity',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      aspectRatio: 'landscape',
    }
  ],

  // Community Projects
  communityProjects: [
    {
      id: 'cp-1',
      title: "If You Stop Loving Me, I'll Die",
      creator: '@marcus_vfx',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      likes: 12400,
      badge: 'PUBLIC',
      prompt: 'Dramatic noir heartbreak scene with glowing rain drops, 35mm film grain, moody blue lights',
      model: 'Seedance 2.5 Pro'
    },
    {
      id: 'cp-2',
      title: 'Cully Hill Boys',
      creator: '@dublin_cinema',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      likes: 9800,
      badge: 'PUBLIC',
      prompt: 'Retro 1980s cinematic documentary tracking young men walking through foggy Irish countryside, Kodak Gold 200',
      model: 'Wan 2.5 Video'
    },
    {
      id: 'cp-3',
      title: 'Red Flag',
      creator: '@studio_neon',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      likes: 8500,
      badge: 'PUBLIC',
      prompt: 'Crimson silk banners waving in storm wind on ancient stone fortress tower, dramatic rim lighting',
      model: 'Genjutsu Motion'
    },
    {
      id: 'cp-4',
      title: 'Kok Boru',
      creator: '@steppe_films',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      likes: 14200,
      badge: 'PUBLIC',
      prompt: 'Epic nomadic horseback riders galloping across dusty central asian mountain plains at sunset, high dynamic range',
      model: 'Seedance 2.5'
    },
    {
      id: 'cp-5',
      title: 'Adiliada',
      creator: '@valeria_art',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      likes: 7100,
      badge: 'PUBLIC',
      prompt: 'High fashion runway model dressed in liquid gold gown turning towards lens, soft studio lighting',
      model: 'Forge Soul Pro'
    },
    {
      id: 'cp-6',
      title: 'ONEIRIC',
      creator: '@dream_weaver',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
      likes: 18900,
      badge: 'PUBLIC',
      prompt: 'Surreal floating crystal island above cloud layer with glowing rivers, pastel twilight atmosphere',
      model: 'GPT Image 2'
    },
    {
      id: 'cp-7',
      title: 'ZEPHYR',
      creator: '@aero_motion',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      likes: 11300,
      badge: 'PUBLIC',
      prompt: 'Futuristic jet gliding inches above neon purple grid ocean, volumetric smoke trails',
      model: 'Supercomputer Pro'
    },
    {
      id: 'cp-8',
      title: 'HELL GRIND',
      creator: '@skate_cyber',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      likes: 6400,
      badge: 'PUBLIC',
      prompt: 'Cybernetic skateboarder doing 540 flip over fiery industrial pit, fisheye lens angle, fast shutter speed',
      model: 'Cinema Studio 2'
    }
  ],

  // GPT Image 2 Gallery
  gptImages: [
    {
      id: 'gpt-1',
      title: 'Typography & Graphic Precision',
      subtitle: 'Crisp vector-grade text rendering on 4K renders',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      tag: 'TEXT RENDER 4K'
    },
    {
      id: 'gpt-2',
      title: 'Product & Commercial Design',
      subtitle: 'Photorealistic studio lighting with accurate reflections',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      tag: 'STUDIO 8K'
    },
    {
      id: 'gpt-3',
      title: 'Editorial Poster Art',
      subtitle: 'High contrast typography integrated seamlessly into character art',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
      tag: 'POSTER ART'
    },
    {
      id: 'gpt-4',
      title: 'Architectural Blueprint Render',
      subtitle: 'Intricate spatial layouts with micro-text labels',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      tag: 'ARCHITECTURE'
    }
  ],

  // Tag cloud / pills
  featureTags: [
    'Cinema Studio',
    'Visual Effects',
    'Forgefield Soul',
    'Camera Controls',
    'Viral',
    'Action movements',
    'Commercial',
    'MiniMax Hailuo 02',
    'Seedance Pro',
    'Community',
    'Wan 2.2 Image',
    'Seedream 4.0',
    'Nano Banana',
    'Flux Kontext',
    'GPT Image',
    'Topaz',
    'Google Veo3',
    'Kling 2.5 Turbo',
    'Kling Avatars 2.0',
    'Claude MCP',
    'Wan 2.5',
    'Sora 2',
    'Sora 2 Presets',
    'Banana Placement',
    'Edit Image',
    'Multi Reference',
    'Upscale',
    'YouTube',
    'TikTok',
    'Instagram Reels',
    'YouTube Shorts',
    'Nano Banana Pro',
    'Kling o1',
    'Mixed Media Community',
    'Soul Presets',
    'Visual Effects Collection'
  ]
};
