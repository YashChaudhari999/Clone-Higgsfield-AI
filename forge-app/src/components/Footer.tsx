'use client';

import Link from 'next/link';
import { ArrowUpRight, Zap } from 'lucide-react';

export default function Footer() {
  const footerColumns = [
    {
      title: 'Create',
      links: ['Text to Video', 'Image to Video', 'VFX Generator', 'Motion Transfer', 'Character Swap', '4K Upscaler']
    },
    {
      title: 'Video Models',
      links: ['Seedance 2.5 Pro', 'Wan 2.5 Motion', 'Kling 2.5 Turbo', 'Sora 2 Presets', 'Google Veo3', 'MiniMax Hailuo']
    },
    {
      title: 'Studios',
      links: ['Cinema Studio', 'Genjutsu Studio', 'Forgefield Soul', 'MCP Agentic Workspace', 'Sound FX Generator']
    },
    {
      title: 'Platform',
      links: ['API Overview', 'Enterprise SLA', 'Supercomputer Access', 'Pricing Plans', 'Changelog', 'System Status']
    },
    {
      title: 'Company',
      links: ['About Forgefield', 'Research Labs', 'Careers', 'Brand Kit', 'Press & Media', 'Contact Us']
    },
    {
      title: 'Resources',
      links: ['Prompting Guide', 'API Documentation', 'Community Showcase', 'Discord Server', 'Tutorials', 'FAQ']
    }
  ];

  return (
    <footer style={{
      background: 'var(--accent-lime)',
      color: '#000000',
      padding: '4rem 1.5rem 2.5rem',
      width: '100%',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        {/* Top Header Block */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingBottom: '3rem',
          borderBottom: '2px solid rgba(0, 0, 0, 0.15)',
          marginBottom: '3rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36,
              height: 36,
              background: '#000000',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Zap size={20} color="var(--accent-lime)" fill="var(--accent-lime)" />
            </div>
            <span style={{
              fontFamily: 'Space Grotesk',
              fontWeight: 800,
              fontSize: '1.5rem',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}>
              Forgefield
            </span>
          </div>

          <h2 className="heading-display" style={{
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            color: '#000000',
            lineHeight: 0.95,
            margin: 0,
          }}>
            AI-NATIVE <br className="hidden sm:block" />CREATIVE SUITE
          </h2>
        </div>

        {/* Link Columns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '2rem',
          paddingBottom: '3.5rem',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          marginBottom: '2.5rem',
        }}>
          {footerColumns.map((col) => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h4 style={{
                fontFamily: 'Space Grotesk',
                fontSize: '0.9rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: '#000000',
                margin: 0,
              }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        color: 'rgba(0, 0, 0, 0.75)',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'color 0.15s',
                      }}
                      className="hover:text-black"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar & Social Links */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          fontSize: '0.825rem',
          fontWeight: 600,
          color: 'rgba(0,0,0,0.8)',
        }}>
          <div>
            © 2026 Forgefield Inc. All rights reserved.
          </div>

          {/* Legal / Policy Links */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: '#000000', textDecoration: 'none' }}>English</a>
            <a href="#" style={{ color: '#000000', textDecoration: 'none' }}>Help center</a>
            <a href="#" style={{ color: '#000000', textDecoration: 'none' }}>Cookie Notice</a>
            <a href="#" style={{ color: '#000000', textDecoration: 'none' }}>Cookie Settings</a>
            <a href="#" style={{ color: '#000000', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: '#000000', textDecoration: 'none' }}>Privacy</a>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '1rem', fontWeight: 800 }}>
            {['X / Twitter', 'YouTube', 'LinkedIn', 'TikTok'].map((social) => (
              <a
                key={social}
                href="#"
                style={{
                  color: '#000000',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                {social} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
