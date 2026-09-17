'use client';

import SectionHeader from './SectionHeader';
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingSection() {
  const plans = [
    {
      name: 'CREATOR',
      price: '$19',
      period: '/month',
      originalPrice: '$29/mo',
      badge: '30% OFF ANNUAL',
      description: 'Ideal for independent creators and digital artists.',
      features: [
        '500 Generation credits / month',
        'Standard 1080p output quality',
        'Seedance 2.5 & Wan 2.5 access',
        'Commercial usage license',
        'Community showcase access',
      ],
      popular: false,
      ctaText: 'Start Free Trial',
    },
    {
      name: 'PRO STUDIO',
      price: '$49',
      period: '/month',
      originalPrice: '$69/mo',
      badge: 'MOST POPULAR · 30% OFF',
      description: 'Built for agencies, VFX artists, and production studios.',
      features: [
        '2,500 Generation credits / month',
        'Ultra 4K master output quality',
        'Genjutsu Motion Transfer access',
        'Supercomputer priority queue (<280ms)',
        'VFX Engine 3.0 full library',
        'API & MCP Agentic access',
      ],
      popular: true,
      ctaText: 'Get Pro Access',
    },
    {
      name: 'ENTERPRISE',
      price: 'CUSTOM',
      period: '',
      description: 'Dedicated GPU cluster infrastructure & custom model fine-tuning.',
      features: [
        'Unlimited generation credits',
        'Custom private model training',
        'Dedicated SLA & 24/7 engineering support',
        'Custom API concurrency limits',
        'SSO & Enterprise security compliance',
      ],
      popular: false,
      ctaText: 'Contact Sales',
    },
  ];

  return (
    <section id="pricing" style={{ padding: '4rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <SectionHeader
        badge="FLEXIBLE PRICING"
        title="TRANSPARENT PLANS FOR CREATORS"
        subtitle="Choose the plan that fits your production pipeline. Save 30% on all annual subscriptions today."
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        alignItems: 'stretch',
      }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: plan.popular ? 'var(--bg-surface)' : 'var(--bg-card)',
              border: plan.popular ? '2px solid var(--accent-lime)' : '1px solid var(--border-default)',
              borderRadius: 24,
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: plan.popular ? '0 20px 48px rgba(0,0,0,0.8), 0 0 32px rgba(200, 255, 0, 0.15)' : 'none',
            }}
          >
            {plan.badge && (
              <div style={{
                position: 'absolute',
                top: '-0.85rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--accent-lime)',
                color: '#000000',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '0.2rem 0.75rem',
                borderRadius: 9999,
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                boxShadow: '0 0 16px rgba(200, 255, 0, 0.4)',
              }}>
                {plan.badge}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <h3 className="heading-display" style={{ fontSize: '1.35rem', color: plan.popular ? 'var(--accent-lime)' : '#ffffff', margin: 0 }}>
                  {plan.name}
                </h3>
                {plan.originalPrice && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {plan.originalPrice}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.75rem' }}>
                <span className="heading-display" style={{ fontSize: '2.8rem', color: '#ffffff', lineHeight: 1 }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {plan.period}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.45 }}>
                {plan.description}
              </p>

              {/* Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {plan.features.map((feat) => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: 'var(--accent-lime-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Check size={12} color="var(--accent-lime)" />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link href="/auth?mode=signup" style={{ textDecoration: 'none' }}>
              <button
                className={plan.popular ? 'btn-lime' : 'btn-dark'}
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.875rem' }}
              >
                {plan.ctaText} <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
