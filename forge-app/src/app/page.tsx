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

      {/* HERO STATEMENT BANNER (FIRST VIEWPORT) */}
      <section style={{
        position: 'relative',
        padding: 'clamp(2rem, 4vw, 3.5rem) 1.5rem 1.25rem',
        textAlign: 'center',
        maxWidth: 1240,
        margin: '0 auto',
      }}>
        {/* Ambient background glow orb */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(200, 255, 0, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Micro Category Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(200, 255, 0, 0.12)',
          border: '1px solid var(--border-lime)',
          padding: '0.3rem 0.8rem',
          borderRadius: 9999,
          marginBottom: '1.1rem',
          boxShadow: '0 0 16px rgba(200, 255, 0, 0.15)',
        }}>
          <Sparkles size={13} color="var(--accent-lime)" />
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-lime)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI-NATIVE CREATIVE ENGINE
          </span>
        </div>

        {/* Scaled H1 Headline */}
        <h1 className="heading-display" style={{
          fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)',
          lineHeight: 1.04,
          color: '#ffffff',
          marginBottom: '1rem',
          letterSpacing: '-0.02em',
          maxWidth: '1080px',
          margin: '0 auto 1rem',
        }}>
          EXPLORE THE WORLD&apos;S MOST ADVANCED <span style={{ color: 'var(--accent-lime)', textShadow: '0 0 24px rgba(200,255,0,0.35)' }}>AI CREATIVE ENGINE</span>
        </h1>

        {/* Punchy Subtitle Paragraph */}
        <p style={{
          fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 1.75rem',
          lineHeight: 1.55,
          fontWeight: 400,
        }}>
          AI-native creative platform for generating and exploring cinema-grade video, motion transfer, and 4K visual content.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard/create" style={{ textDecoration: 'none' }}>
            <button className="btn-lime" style={{ padding: '0.75rem 1.85rem', fontSize: '0.88rem' }}>
              <Wand2 size={16} /> Open Studio Free
            </button>
          </Link>
          <a href="#genjutsu" style={{ textDecoration: 'none' }}>
            <button className="btn-dark" style={{ padding: '0.75rem 1.6rem', fontSize: '0.88rem' }}>
              <Play size={15} fill="currentColor" /> Watch Demos
            </button>
          </a>
        </div>
      </section>

      {/* 3. FEATURED CREATIVE / PRODUCT CARDS (PEEKS INTO FIRST VIEWPORT) */}
      <div style={{ marginTop: '-0.5rem' }}>
        <FeaturedGrid onCardClick={handleOpenModal} />
      </div>

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
      <SeedanceSection onCardClick={handleOpenModal} />

      {/* 7. COMMUNITY / PROJECT GALLERY */}
      <CommunitySection onProjectClick={handleOpenModal} />

      {/* 8. SUPERCOMPUTER PROMOTIONAL SECTION */}
      <SupercomputerSection
        onTrySupercomputer={() => {
          window.location.href = '/dashboard/create';
        }}
      />

      {/* 9. GPT IMAGE SECTION */}
      <GptImageSection onCardClick={handleOpenModal} />

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
