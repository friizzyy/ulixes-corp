export default function MockupsPage() {
  return (
    <div style={{ background: '#0a0a0b', color: '#fafafa', padding: '40px 24px 80px', maxWidth: 1100, margin: '0 auto', fontFamily: 'var(--font-outfit), system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>Tab Button Redesign</h1>
      <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginBottom: 56, lineHeight: 1.6 }}>
        Three alternatives to the current card-style tabs. Each shown in both inline (3-col process) and grid (4-col services) layout. Active state is the first item.
      </p>

      {/* ========== CURRENT ========== */}
      <Section label="Current" title="Card Tabs with Top Bar Indicator" desc="Large card backgrounds with a bright purple top edge on active. Visually heavy and competes with content below.">
        <SubLabel>4-column (services)</SubLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {['Calypso Implementation', 'Platform Migration', 'AI-Driven Compliance', 'Intelligent Testing'].map((label, i) => (
            <div key={i} style={{
              position: 'relative',
              background: i === 0 ? '#1f1f23' : '#111113',
              border: i === 0 ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: 20,
              textAlign: 'left',
              overflow: 'hidden',
            }}>
              {i === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#8B5CF6', borderRadius: '12px 12px 0 0' }} />}
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
                background: i === 0 ? 'rgba(139,92,246,0.2)' : '#1f1f23',
                color: i === 0 ? '#8B5CF6' : '#71717a',
                fontSize: '0.75rem', fontFamily: 'var(--font-jetbrains), monospace',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: i === 0 ? '#fafafa' : '#a1a1aa' }}>{label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Hr />

      {/* ========== OPTION A ========== */}
      <Section label="Option A" title="Underline Minimal" desc="Clean inline tabs with a subtle accent underline. No card backgrounds — just text that gets out of the way. The active state is a single 1px line and brighter text. Quiet, elegant, lets the content panel do the talking.">
        <SubLabel>Inline (process)</SubLabel>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
          {['Assess', 'Design', 'Execute'].map((label, i) => (
            <div key={i} style={{
              position: 'relative',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.6875rem', color: i === 0 ? '#8B5CF6' : '#71717a' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: i === 0 ? '#fafafa' : '#71717a', whiteSpace: 'nowrap' }}>
                {label}
              </span>
              {i === 0 && <div style={{ position: 'absolute', bottom: -1, left: 24, right: 24, height: 1, background: '#8B5CF6' }} />}
            </div>
          ))}
        </div>

        <SubLabel>4-column (services)</SubLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['Calypso Implementation', 'Platform Migration', 'AI-Driven Compliance', 'Intelligent Testing'].map((label, i) => (
            <div key={i} style={{
              position: 'relative',
              padding: '16px 16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.6875rem', color: i === 0 ? '#8B5CF6' : '#71717a' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: i === 0 ? '#fafafa' : '#71717a' }}>
                {label}
              </span>
              {i === 0 && <div style={{ position: 'absolute', bottom: -1, left: 16, right: 16, height: 1, background: '#8B5CF6' }} />}
            </div>
          ))}
        </div>

        <Traits items={['minimal', 'no background', 'underline indicator', 'very quiet']} />
      </Section>

      <Hr />

      {/* ========== OPTION B ========== */}
      <Section label="Option B" title="Segmented Control" desc="Tabs sit inside a subtle recessed container. The active tab gets a raised surface fill with a soft shadow — like a physical toggle. Inactive tabs blend into the background until hovered. Tactile but not loud.">
        <SubLabel>Inline (process)</SubLabel>
        <div style={{
          display: 'inline-flex',
          gap: 6,
          padding: 4,
          background: '#111113',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 28,
        }}>
          {['Assess', 'Design', 'Execute'].map((label, i) => (
            <div key={i} style={{
              padding: '10px 20px',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: i === 0 ? '#1f1f23' : 'transparent',
              boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.6875rem', color: i === 0 ? '#8B5CF6' : '#71717a' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: i === 0 ? '#fafafa' : '#71717a', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <SubLabel>4-column (services)</SubLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
          padding: 6,
          background: '#111113',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {['Calypso Implementation', 'Platform Migration', 'AI-Driven Compliance', 'Intelligent Testing'].map((label, i) => (
            <div key={i} style={{
              padding: '14px 16px',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              background: i === 0 ? '#1f1f23' : 'transparent',
              boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.6875rem', color: i === 0 ? '#8B5CF6' : '#71717a' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: i === 0 ? '#fafafa' : '#71717a' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <Traits items={['contained', 'raised active', 'segmented feel', 'tactile']} />
      </Section>

      <Hr />

      {/* ========== OPTION C ========== */}
      <Section label="Option C" title="Left-Border Index" desc="A 2px accent left border marks the active tab with a barely-there gradient wash. Leans into the terminal/monospace aesthetic — each tab reads like an indexed entry. Compact, architectural, zero noise.">
        <SubLabel>Inline (process)</SubLabel>
        <div style={{ display: 'flex', gap: 2, marginBottom: 28 }}>
          {['Assess', 'Design', 'Execute'].map((label, i) => (
            <div key={i} style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderLeft: i === 0 ? '2px solid #8B5CF6' : '2px solid transparent',
              background: i === 0 ? 'linear-gradient(90deg, rgba(139,92,246,0.06) 0%, transparent 100%)' : 'none',
            }}>
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.75rem', fontWeight: 600,
                color: i === 0 ? '#8B5CF6' : '#71717a',
                opacity: i === 0 ? 1 : 0.5,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: i === 0 ? '#fafafa' : '#71717a', whiteSpace: 'nowrap' }}>
                {label}
              </span>
              {i === 0 && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#8B5CF6', flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <SubLabel>4-column (services)</SubLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {['Calypso Implementation', 'Platform Migration', 'AI-Driven Compliance', 'Intelligent Testing'].map((label, i) => (
            <div key={i} style={{
              padding: '16px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              borderLeft: i === 0 ? '2px solid #8B5CF6' : '2px solid transparent',
              background: i === 0 ? 'linear-gradient(90deg, rgba(139,92,246,0.06) 0%, transparent 100%)' : 'none',
            }}>
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.75rem', fontWeight: 600,
                color: i === 0 ? '#8B5CF6' : '#71717a',
                opacity: i === 0 ? 1 : 0.5,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: i === 0 ? '#fafafa' : '#71717a' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <Traits items={['editorial', 'left-border accent', 'gradient wash', 'terminal-native']} />
      </Section>

    </div>
  )
}

function Section({ label, title, desc, children }: { label: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 72 }}>
      <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8B5CF6', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 4, letterSpacing: '-0.01em' }}>{title}</div>
      <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginBottom: 28, lineHeight: 1.6, maxWidth: 640 }}>{desc}</p>
      {children}
    </div>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: 16, fontFamily: 'var(--font-jetbrains), monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{children}</div>
}

function Hr() {
  return <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '56px 0' }} />
}

function Traits({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
      {items.map(t => (
        <span key={t} style={{ fontSize: '0.75rem', color: '#71717a', padding: '4px 10px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, fontFamily: 'var(--font-jetbrains), monospace' }}>{t}</span>
      ))}
    </div>
  )
}
