'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Zap, Film, Image as ImageIcon, ChevronDown, Sparkles,
  RefreshCw, Download, Save, Copy, AlertCircle, CheckCircle,
  Clock, Loader2, RotateCcw, X,
} from 'lucide-react';
import { MODELS, DEMO_PROMPTS } from '@/lib/data';
import { getGenerations, saveGeneration, getThumbnailStyle } from '@/lib/storage';
import { Generation, GenerationStatus, CreationType, AspectRatio, Duration, Model } from '@/lib/types';

const ASPECT_RATIOS: AspectRatio[] = ['16:9', '9:16', '1:1', '4:3', '21:9'];
const DURATIONS: Duration[] = ['3s', '5s', '8s', '10s'];

const GENERATION_STEPS = [
  'Initializing model...',
  'Parsing your prompt...',
  'Building scene composition...',
  'Rendering frames...',
  'Applying cinematic grading...',
  'Finalizing output...',
];

function CreateWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';
  const viewId = searchParams.get('view');

  // Form state
  const [type, setType] = useState<CreationType>('video');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [modelId, setModelId] = useState('forge-video-2');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState<Duration>('5s');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Generation state
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState('');
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<Generation[]>([]);
  const [copied, setCopied] = useState(false);

  const availableModels = MODELS.filter(m => m.type.includes(type));
  const selectedModel = MODELS.find(m => m.id === modelId) || availableModels[0];

  useEffect(() => {
    setHistory(getGenerations());
  }, []);

  useEffect(() => {
    // If viewing a past generation
    if (viewId) {
      const gens = getGenerations();
      const gen = gens.find(g => g.id === viewId);
      if (gen) {
        setCurrentGeneration(gen);
        setStatus(gen.status);
        setPrompt(gen.prompt);
        setType(gen.type);
        setModelId(gen.modelId);
        setAspectRatio(gen.aspectRatio);
        if (gen.duration) setDuration(gen.duration);
        setSaved(true);
      }
    }
  }, [viewId]);

  // Sync model when type changes
  useEffect(() => {
    const models = MODELS.filter(m => m.type.includes(type));
    if (!models.find(m => m.id === modelId)) {
      setModelId(models[0].id);
    }
  }, [type, modelId]);

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError('Please enter a prompt to generate.'); return; }
    if (prompt.trim().length < 5) { setError('Prompt is too short. Add more detail.'); return; }

    setError('');
    setStatus('generating');
    setProgress(0);
    setSaved(false);
    setCopied(false);

    const genId = crypto.randomUUID();
    const newGen: Generation = {
      id: genId,
      prompt: prompt.trim(),
      negativePrompt: negativePrompt.trim() || undefined,
      model: selectedModel?.name || 'Forge Video 2',
      modelId,
      type,
      aspectRatio,
      duration: type === 'video' ? duration : undefined,
      status: 'generating',
      createdAt: new Date().toISOString(),
    };
    setCurrentGeneration(newGen);
    saveGeneration(newGen);

    // Simulate generation with step labels
    const totalTime = 8000 + Math.random() * 4000;
    const stepInterval = totalTime / GENERATION_STEPS.length;

    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, stepInterval));
      setStepLabel(GENERATION_STEPS[i]);
      setProgress(Math.round(((i + 1) / GENERATION_STEPS.length) * 100));
    }

    await new Promise(r => setTimeout(r, 600));

    // Complete
    const sampleImages = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    ];
    const resultImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    const completed: Generation = {
      ...newGen,
      status: 'completed',
      completedAt: new Date().toISOString(),
      resultUrl: resultImg,
    };
    setCurrentGeneration(completed);
    saveGeneration(completed);
    setStatus('completed');
    setProgress(100);
    setHistory(getGenerations());
  };

  const handleSave = () => {
    if (currentGeneration) {
      saveGeneration(currentGeneration);
      setSaved(true);
      setHistory(getGenerations());
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRegenerate = () => {
    setStatus('idle');
    setCurrentGeneration(null);
    setSaved(false);
    setProgress(0);
  };

  const handleNewGeneration = () => {
    setStatus('idle');
    setCurrentGeneration(null);
    setPrompt('');
    setNegativePrompt('');
    setSaved(false);
    setProgress(0);
    router.replace('/dashboard/create');
  };

  const randomPrompt = () => {
    const p = DEMO_PROMPTS[Math.floor(Math.random() * DEMO_PROMPTS.length)];
    setPrompt(p);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      overflow: 'hidden',
    }} className="flex-col md:flex-row">
      {/* LEFT PANEL — Controls */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        flexShrink: 0,
        overflowY: 'auto',
        borderRight: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
      }} className="max-md:max-w-none max-md:border-r-0 max-md:border-b">
        <div style={{ padding: '1.5rem', flex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.25rem', fontWeight: 700 }}>Create</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Describe your vision and let Forge bring it to life.
            </p>
          </div>

          {/* Type selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Creation Type
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['video', 'image'] as CreationType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    flex: 1, padding: '0.625rem', borderRadius: 8,
                    border: `1px solid ${type === t ? 'var(--accent-lime)' : 'var(--border-default)'}`,
                    background: type === t ? 'var(--accent-lime-dim)' : 'var(--bg-elevated)',
                    color: type === t ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '0.5rem',
                    fontSize: '0.875rem', fontWeight: 700, transition: 'all 0.15s',
                  }}
                >
                  {t === 'video' ? <Film size={15} /> : <ImageIcon size={15} />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Model selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Model
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {availableModels.map(m => (
                <button
                  key={m.id}
                  onClick={() => setModelId(m.id)}
                  style={{
                    padding: '0.75rem', borderRadius: 8, textAlign: 'left',
                    border: `1px solid ${modelId === m.id ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                    background: modelId === m.id ? 'var(--accent-lime-dim)' : 'var(--bg-elevated)',
                    cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: modelId === m.id ? 'var(--accent-lime)' : 'var(--border-strong)',
                    boxShadow: modelId === m.id ? '0 0 8px var(--accent-lime)' : 'none',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: modelId === m.id ? 'var(--accent-lime)' : 'var(--text-primary)' }}>
                        {m.name}
                      </span>
                      {m.badge && (
                        <span className="nav-lime-pill" style={{ fontSize: '0.6rem' }}>
                          {m.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3, marginTop: '0.125rem' }}>
                      {m.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Aspect Ratio
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {ASPECT_RATIOS.map(ar => (
                <button
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  style={{
                    padding: '0.375rem 0.75rem', borderRadius: 6,
                    border: `1px solid ${aspectRatio === ar ? 'var(--accent-lime)' : 'var(--border-default)'}`,
                    background: aspectRatio === ar ? 'var(--accent-lime-dim)' : 'var(--bg-elevated)',
                    color: aspectRatio === ar ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.15s',
                  }}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          {/* Duration — video only */}
          {type === 'video' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Duration
              </label>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    style={{
                      flex: 1, padding: '0.5rem', borderRadius: 6,
                      border: `1px solid ${duration === d ? 'var(--accent-lime)' : 'var(--border-default)'}`,
                      background: duration === d ? 'var(--accent-lime-dim)' : 'var(--bg-elevated)',
                      color: duration === d ? 'var(--accent-lime)' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.15s',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Advanced toggle */}
          <button
            onClick={() => setShowAdvanced(v => !v)}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'space-between', marginBottom: showAdvanced ? '0.75rem' : '1.5rem', fontSize: '0.8rem' }}
          >
            <span>Advanced settings</span>
            <ChevronDown size={14} style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showAdvanced && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                Negative Prompt
              </label>
              <textarea
                className="input-base"
                placeholder="What to avoid: blurry, distorted, low quality..."
                value={negativePrompt}
                onChange={e => setNegativePrompt(e.target.value)}
                rows={3}
                style={{ resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>
          )}

          {/* Prompt input */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Prompt
              </label>
              <button onClick={randomPrompt} className="btn-ghost" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', gap: '0.25rem', color: 'var(--accent-lime)' }}>
                <RefreshCw size={11} /> Random
              </button>
            </div>
            <textarea
              id="prompt-input"
              className="input-base"
              placeholder="Describe your vision in detail... e.g. 'Cinematic drone shot soaring over a cyberpunk city at dusk, neon reflections on wet streets'"
              value={prompt}
              onChange={e => { setPrompt(e.target.value); setError(''); }}
              rows={5}
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', color: prompt.length > 400 ? 'var(--error)' : 'var(--text-muted)' }}>
                {prompt.length}/500
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.625rem 0.875rem', borderRadius: 8, marginBottom: '1rem',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444', fontSize: '0.8rem',
            }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Generate button */}
          <button
            id="generate-btn"
            className="btn-lime"
            onClick={handleGenerate}
            disabled={status === 'generating'}
            style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '0.9375rem' }}
          >
            {status === 'generating' ? (
              <>
                <Loader2 size={17} className="animate-spin-slow" /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={17} /> Generate
              </>
            )}
          </button>
        </div>

        {/* Sidebar history */}
        {history.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '1rem 1.5rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              Recent
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {history.slice(0, 5).map(g => (
                <button
                  key={g.id}
                  onClick={() => {
                    setCurrentGeneration(g);
                    setStatus(g.status);
                    setPrompt(g.prompt);
                    setType(g.type);
                    setModelId(g.modelId);
                    if (g.aspectRatio) setAspectRatio(g.aspectRatio);
                    if (g.duration) setDuration(g.duration);
                    setSaved(true);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.5rem 0.625rem', borderRadius: 8,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'border-color 0.15s',
                  }}
                  className="card-hover"
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 6, flexShrink: 0,
                    background: getThumbnailStyle(g.id),
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {g.prompt.slice(0, 40)}...
                    </p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {g.type} · {new Date(g.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL — Result */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-base)' }}>
        {status === 'idle' && !currentGeneration ? (
          // Empty state
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
            <div style={{
              width: 72, height: 72, borderRadius: 18,
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={30} color="var(--text-muted)" />
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.25rem', fontWeight: 700, textAlign: 'center' }}>
              Your creation will appear here
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', maxWidth: 380 }}>
              Enter a prompt on the left, configure your settings, then click Generate.
            </p>
          </div>
        ) : status === 'generating' ? (
          // Generation state
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
            {/* Animated preview */}
            <div style={{
              width: '100%', maxWidth: 680,
              aspectRatio: aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : '16/9',
              maxHeight: 420,
              borderRadius: 16,
              background: currentGeneration ? getThumbnailStyle(currentGeneration.id) : 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div className="animate-shimmer" style={{ position: 'absolute', inset: 0 }} />
              {/* Spinning ring */}
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                border: '2px solid rgba(200,255,0,0.2)',
                borderTopColor: 'var(--accent-lime)',
                position: 'relative', zIndex: 1,
              }} className="animate-spin-slow" />
            </div>

            {/* Progress */}
            <div style={{ width: '100%', maxWidth: 480 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {stepLabel || 'Starting...'}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-lime)' }}>{progress}%</span>
              </div>
              <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: 'var(--accent-lime)', borderRadius: 2,
                  width: `${progress}%`, transition: 'width 0.6s ease',
                }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.625rem', textAlign: 'center' }}>
                Generating {type} · {selectedModel?.name} · {aspectRatio}{type === 'video' ? ` · ${duration}` : ''}
              </p>
            </div>
          </div>
        ) : status === 'completed' && currentGeneration ? (
          // Result state
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
            {/* Action bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} color="var(--success)" />
                <span style={{ fontWeight: 600, color: 'var(--success)', fontSize: '0.875rem' }}>Generation complete</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn-ghost" onClick={handleCopyPrompt} style={{ fontSize: '0.8rem' }}>
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy prompt'}
                </button>
                <button className="btn-dark" onClick={handleRegenerate} style={{ fontSize: '0.8rem' }}>
                  <RotateCcw size={14} /> Regenerate
                </button>
                <button
                  className="btn-dark"
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = currentGeneration.resultUrl || '#';
                    a.download = `forge-${currentGeneration.id.slice(0, 8)}.jpg`;
                    a.target = '_blank';
                    a.click();
                  }}
                >
                  <Download size={14} /> Download
                </button>
                <button
                  id="save-btn"
                  className={saved ? 'btn-dark' : 'btn-lime'}
                  onClick={handleSave}
                  style={{ fontSize: '0.8rem' }}
                >
                  {saved ? <><CheckCircle size={14} /> Saved</> : <><Save size={14} /> Save</>}
                </button>
              </div>
            </div>

            {/* Result preview */}
            <div style={{
              width: '100%',
              background: 'var(--bg-surface)',
              borderRadius: 16, border: '1px solid var(--border-default)',
              overflow: 'hidden', marginBottom: '1.5rem',
            }}>
              <div style={{
                width: '100%',
                aspectRatio: aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : '16/9',
                maxHeight: 460,
                background: getThumbnailStyle(currentGeneration.id),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Gradient shimmer as "rendered" output */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `${getThumbnailStyle(currentGeneration.id)}, linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.5) 100%)`,
                }} />
                {type === 'video' && (
                  <div style={{
                    position: 'relative', zIndex: 1,
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                  }}>
                    <Zap size={22} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem', marginBottom: '1.5rem',
            }}>
              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Model</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{currentGeneration.model}</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Type</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{currentGeneration.type.charAt(0).toUpperCase() + currentGeneration.type.slice(1)}</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Aspect Ratio</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{currentGeneration.aspectRatio}</p>
              </div>
              {currentGeneration.duration && (
                <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Duration</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{currentGeneration.duration}</p>
                </div>
              )}
              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Created</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {new Date(currentGeneration.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Prompt */}
            <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Prompt used</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentGeneration.prompt}
              </p>
            </div>

            {/* New generation */}
            <button className="btn-dark" onClick={handleNewGeneration} style={{ width: '100%', justifyContent: 'center' }}>
              <X size={15} /> Start new generation
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div style={{ flex: 1, background: 'var(--bg-base)' }} />}>
      <CreateWorkspace />
    </Suspense>
  );
}
