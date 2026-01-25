'use client'

import { useMemo } from 'react'
import { Section, SectionHeader, Button } from '@/components/ui'
import {
  FeatureShowcase,
  BentoGrid,
  DataFlowVisualizer,
  StreamingDataPanel,
  LogStreamViewer,
  PipelineVisualizer,
  CodeBlockLive,
  TimelineVertical,
  ComparisonTable,
  TerminalCommandPanel,
  ExecutionFeedbackList,
  CommandPalette,
  useCommandPalette,
  useMockLogStream,
} from '@/components/system'

export function CommandCenterSection() {
  const { isOpen, open, close } = useCommandPalette()
  const logs = useMockLogStream(1400)

  const commands = useMemo(
    () => [
      {
        id: 'briefing',
        label: 'Schedule executive briefing',
        description: 'Align on scope, timelines, and constraints',
        shortcut: '⌘ B',
        category: 'Engagement',
        action: () => {
          window.location.href = '/contact'
        },
      },
      {
        id: 'architecture',
        label: 'Download architecture blueprint',
        description: 'Reference patterns for capital-aware systems',
        shortcut: '⌘ D',
        category: 'Resources',
        action: () => {
          window.location.href = '/work'
        },
      },
      {
        id: 'risk',
        label: 'Open risk controls',
        description: 'View controls checklist and validations',
        shortcut: '⌘ R',
        category: 'Controls',
        action: () => {},
      },
      {
        id: 'audit',
        label: 'Audit trail snapshot',
        description: 'Export evidence for external review',
        shortcut: '⌘ A',
        category: 'Controls',
        action: () => {},
      },
    ],
    []
  )

  const dataFlowNodes = [
    { id: 'trade', label: 'Trade Capture', type: 'source' as const, status: 'active' as const },
    { id: 'validate', label: 'Validation', type: 'process' as const },
    { id: 'account', label: 'Accounting', type: 'process' as const },
    { id: 'capital', label: 'Capital Engine', type: 'storage' as const },
    { id: 'ledger', label: 'Reg Ledger', type: 'destination' as const },
  ]

  const dataFlows = [
    { from: 'trade', to: 'validate', throughput: '1.3k/s' },
    { from: 'validate', to: 'account', throughput: '1.2k/s' },
    { from: 'account', to: 'capital', throughput: '1.1k/s' },
    { from: 'capital', to: 'ledger', throughput: '1.0k/s' },
  ]

  const streamingData = [
    { id: 'rwa', label: 'RWA Impact', value: -12.4, unit: 'bps', trend: 'down' as const, timestamp: new Date() },
    { id: 'pnl', label: 'P&L Volatility', value: 0.8, unit: '%', trend: 'down' as const, timestamp: new Date() },
    { id: 'hedge', label: 'Hedge Effectiveness', value: 98.7, unit: '%', trend: 'up' as const, timestamp: new Date() },
    { id: 'audit', label: 'Audit Exceptions', value: 0, trend: 'stable' as const, timestamp: new Date() },
  ]

  const pipelineStages = [
    { id: 'ingest', name: 'Ingest', status: 'complete' as const, duration: '2.1s' },
    { id: 'normalize', name: 'Normalize', status: 'complete' as const, duration: '3.4s' },
    { id: 'validate', name: 'Validate', status: 'running' as const, duration: '8.9s' },
    { id: 'publish', name: 'Publish', status: 'pending' as const },
  ]

  const timelineItems = [
    { id: 'design', title: 'Designation', description: 'Policy approval + documentation', status: 'complete' as const },
    { id: 'hedge', title: 'Hedge Execution', description: 'Trade capture and risk controls', status: 'complete' as const },
    { id: 'effectiveness', title: 'Effectiveness Testing', description: 'Ongoing validation + thresholds', status: 'current' as const },
    { id: 'reporting', title: 'Reporting', description: 'Regulatory and audit outputs', status: 'upcoming' as const },
  ]

  const executionFeedback = [
    {
      id: 'exec-1',
      action: 'Validate capital treatment',
      result: 'success' as const,
      latencyMs: 482,
      timestamp: new Date(),
      details: 'Basel III aligned',
    },
    {
      id: 'exec-2',
      action: 'Reconcile hedge documentation',
      result: 'success' as const,
      latencyMs: 771,
      timestamp: new Date(),
      details: 'ASC 815 thresholds met',
    },
    {
      id: 'exec-3',
      action: 'Stress scenario replay',
      result: 'pending' as const,
      latencyMs: 0,
      timestamp: new Date(),
      details: 'Processing 9 scenarios',
    },
  ]

  const comparisonItems = [
    {
      feature: 'Capital treatment',
      before: 'Manual review',
      after: 'Automated + traceable',
      improvement: '42%',
    },
    {
      feature: 'Accounting alignment',
      before: 'Fragmented',
      after: 'Unified lifecycle',
      improvement: '68%',
    },
    {
      feature: 'Audit trail',
      before: false,
      after: true,
      improvement: '100%',
    },
    {
      feature: 'Operational latency',
      before: '4.6s',
      after: '900ms',
      improvement: '80%',
    },
  ]

  const terminalHistory = [
    { id: 'cmd-1', type: 'input' as const, content: '$ ulixes check --portfolio core', timestamp: new Date() },
    { id: 'cmd-2', type: 'output' as const, content: 'Scenario grid loaded (12 vectors)', timestamp: new Date() },
    { id: 'cmd-3', type: 'output' as const, content: 'Capital delta within guardrails', timestamp: new Date() },
    { id: 'cmd-4', type: 'success' as const, content: '[OK] Controls verified in 38ms', timestamp: new Date() },
  ]

  const codeSnippet = `export const hedgePolicy = definePolicy({
  designation: 'cash-flow',
  instruments: ['swap', 'fx-forward'],
  effectiveness: {
    threshold: 0.8,
    window: 'quarterly'
  },
  reporting: {
    auditTrail: true,
    capitalView: 'basel-iii'
  }
})`

  const bentoItems = [
    {
      id: 'streaming',
      title: 'Streaming risk telemetry',
      description: 'Live metrics with automated guardrails.',
      span: 'wide' as const,
      visual: (
        <div className="h-full p-4">
          <StreamingDataPanel
            title="Portfolio Telemetry"
            data={streamingData}
            showTimestamp={false}
            compact
            className="h-full"
          />
        </div>
      ),
    },
    {
      id: 'logs',
      title: 'Audit-grade event stream',
      description: 'Evidence-ready logs with provenance.',
      visual: (
        <div className="h-full p-4">
          <LogStreamViewer
            logs={logs}
            showFilters={false}
            showTimestamp={false}
            showSource={false}
            className="h-full"
          />
        </div>
      ),
    },
    {
      id: 'pipeline',
      title: 'Execution pipeline',
      description: 'Lifecycle stages with measured latency.',
      visual: (
        <div className="h-full p-4">
          <PipelineVisualizer stages={pipelineStages} />
        </div>
      ),
    },
    {
      id: 'code',
      title: 'Policy as code',
      description: 'Designate, validate, and report in one layer.',
      span: 'wide' as const,
      visual: (
        <div className="h-full p-4">
          <CodeBlockLive
            code={codeSnippet}
            filename="hedge-policy.ts"
            maxHeight="200px"
            highlightLines={[2, 5, 9]}
          />
        </div>
      ),
    },
    {
      id: 'timeline',
      title: 'Lifecycle traceability',
      description: 'Every event anchored to its control.',
      visual: (
        <div className="h-full p-4 overflow-hidden">
          <TimelineVertical items={timelineItems} />
        </div>
      ),
    },
    {
      id: 'guardrails',
      title: 'Guardrails built-in',
      description: 'Controls fire before financial exposure compounds.',
      visual: (
        <div className="h-full p-4">
          <div className="h-full rounded-md border border-border bg-bg-tertiary/60 p-4">
            <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
              Control Coverage
            </div>
            <div className="mt-4 space-y-3 text-sm text-text-secondary">
              <div className="flex items-center justify-between">
                <span>Accounting checks</span>
                <span className="text-accent">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Capital validation</span>
                <span className="text-accent">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Regulatory mapping</span>
                <span className="text-accent">92%</span>
              </div>
              <div className="mt-4 h-px bg-gradient-to-r from-accent/40 to-transparent" />
              <div className="text-xs text-text-muted">Drift alerts enabled</div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <Section id="command-center" className="bg-bg-secondary/40 border-y border-border">
      <SectionHeader
        label="Control Surface"
        title="Operational command center for capital-aware systems"
        description="A premium layer of visual control, instrumentation, and audit-grade output—designed for CFO, CAO, and risk leadership teams."
      />

      <div className="space-y-16">
        <FeatureShowcase
          badge="Live orchestration"
          title="Trade, accounting, and capital stay synchronized."
          description="We model the full lifecycle so each event remains connected to its accounting intent, capital treatment, and regulatory footprint."
          features={[
            'Lifecycle-aware booking models',
            'Capital and accounting in the same execution path',
            'Immediate traceability for audit review',
          ]}
          visual={
            <DataFlowVisualizer
              title="Lifecycle Flow"
              nodes={dataFlowNodes}
              flows={dataFlows}
            />
          }
        />

        <BentoGrid items={bentoItems} />

        <ComparisonTable
          title="Before vs. After Ulixes Architecture"
          description="Control improvements measured in weeks, not quarters."
          items={comparisonItems}
          className="mt-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <TerminalCommandPanel
            title="Control Console"
            initialHistory={terminalHistory}
          />
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-bg-secondary/70 p-5">
              <div className="text-sm font-mono text-text-muted uppercase tracking-wider mb-3">
                Execution Feedback
              </div>
              <ExecutionFeedbackList executions={executionFeedback} autoDismiss={false} />
            </div>
            <PipelineVisualizer stages={pipelineStages} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={open}>
            Open Command Palette
          </Button>
          <Button size="lg" variant="secondary" href="/contact">
            Request a Briefing
          </Button>
        </div>
      </div>

      <CommandPalette commands={commands} isOpen={isOpen} onClose={close} />
    </Section>
  )
}
