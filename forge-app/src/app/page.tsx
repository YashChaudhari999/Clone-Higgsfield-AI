'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import PromoBanner from '@/components/PromoBanner';
import FeaturedGrid from '@/components/FeaturedGrid';
import VisualEffectsSection from '@/components/VisualEffectsSection';
import GenjutsuSection from '@/components/GenjutsuSection';
import SeedanceSection from '@/components/SeedanceSection';
import CommunitySection from '@/components/CommunitySection';
import SupercomputerSection from '@/components/SupercomputerSection';
import GptImageSection from '@/components/GptImageSection';
import PricingSection from '@/components/PricingSection';
import FeaturePills from '@/components/FeaturePills';
import Footer from '@/components/Footer';
import ProjectModal from '@/components/ProjectModal';
import { MediaItem } from '@/lib/media';
import Link from 'next/link';
import { Sparkles, ArrowRight, Play, Wand2 } from 'lucide-react';

export default function ExploreLandingPage() {
  const [activeModalItem, setActiveModalItem] = useState<MediaItem | null>(null);

  const handleOpenModal = (item: MediaItem) => {
    setActiveModalItem(item);
  };

  const handleCloseModal = () => {
    setActiveModalItem(null);
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', color: '#ffffff' }}>
      {/* 2. PROMOTIONAL BANNER (AT TOP) */}
      <PromoBanner
        onAction={() => {
          window.location.href = '/auth?mode=signup';
        }}
      />

      {/* 1. STICKY TOP NAVIGATION */}
      <Navbar
        onOpenGenerateModal={() => {
          window.location.href = '/dashboard/create';
        }}
      />

      {/* HERO STATEMENT BANNER */}
      <section style={{
        position: 'relative',
        padding: 'clamp(3rem, 6vw, 5rem) 1.5rem 2rem',
        textAlign: 'center',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {/* Background glow orb */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(200, 255, 0, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(200, 255, 0, 0.1)',
          border: '1px solid var(--border-lime)',
          padding: '0.35rem 0.85rem',
          borderRadius: 9999,
          marginBottom: '1.5rem',
        }}>
          <Sparkles size={14} color="var(--accent-lime)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-lime)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            THE NEXT ERA OF AI CREATIVITY
          </span>
        </div>

        <h1 className="heading-display" style={{
          fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
          lineHeight: 1.0,
          color: '#ffffff',
          marginBottom: '1.25rem',
          letterSpacing: '-0.02em',
        }}>
          EXPLORE THE WORLD'S MOST ADVANCED <span style={{ color: 'var(--accent-lime)', textShadow: '0 0 24px rgba(200,255,0,0.3)' }}>AI CREATIVE ENGINE</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '740px',
          margin: '0 auto 2.25rem',
          lineHeight: 1.6,
        }}>
          Generate cinema-grade video, reality-swapping motion, and ultra-high resolution images with sub-second temporal consistency.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard/create">
            <button className="btn-lime" style={{ padding: '0.875rem 2rem', fontSize: '0.95rem' }}>
              <Wand2 size={18} /> Open Studio Free
            </button>
          </Link>
          <a href="#genjutsu">
            <button className="btn-dark" style={{ padding: '0.875rem 1.75rem', fontSize: '0.95rem' }}>
              <Play size={16} fill="currentColor" /> Watch Demos
            </button>
          </a>
        </div>
      </section>

      {/* 3. FEATURED CREATIVE / PRODUCT CARDS */}
      <FeaturedGrid onCardClick={handleOpenModal} />

      {/* 4. VISUAL EFFECTS SECTION */}
      <VisualEffectsSection onRecreate={handleOpenModal} />

      {/* 5. GENJUTSU FEATURE SECTION */}
      <GenjutsuSection
        onStartGenerate={() => {
          window.location.href = '/dashboard/create';
        }}
        onLearnMore={() => {
          const el = document.getElementById('effects');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 6. SEEDANCE SECTION */}
      <SeedanceSection />

      {/* 7. COMMUNITY / PROJECT GALLERY */}
      <CommunitySection onProjectClick={handleOpenModal} />

      {/* 8. SUPERCOMPUTER PROMOTIONAL SECTION */}
      <SupercomputerSection
        onTrySupercomputer={() => {
          window.location.href = '/dashboard/create';
        }}
      />

      {/* 9. GPT IMAGE SECTION */}
      <GptImageSection />

      {/* PRICING SECTION */}
      <PricingSection />

      {/* 10. MORE AI FEATURES */}
      <FeaturePills />

      {/* 11. LARGE LIME FOOTER */}
      <Footer />

      {/* PROMPT INSPECTOR MODAL */}
      <ProjectModal
        item={activeModalItem}
        onClose={handleCloseModal}
      />
    </div>
  );
}
