'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { formatLatency, formatSystemTime } from '@/lib/system'
import { GlassSurfaceContainer } from './GlassSurfaceContainer'

interface CommandOutput {
  id: string
  type: 'input' | 'output' | 'error' | 'success'
  content: string
  timestamp: Date
}

interface TerminalCommandPanelProps {
  onCommand?: (command: string) => Promise<{ output: string[]; success: boolean }>
  prompt?: string
  title?: string
  className?: string
  initialHistory?: CommandOutput[]
  maxHistory?: number
}

export function TerminalCommandPanel({
  onCommand,
  prompt = '$',
  title = 'Terminal',
  className,
  initialHistory = [],
  maxHistory = 100,
}: TerminalCommandPanelProps) {
  const [history, setHistory] = useState<CommandOutput[]>(initialHistory)
  const [input, setInput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const addOutput = useCallback((type: CommandOutput['type'], content: string) => {
    const entry: CommandOutput = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
    }
    setHistory(prev => {
      const updated = [...prev, entry]
      return updated.slice(-maxHistory)
    })
  }, [maxHistory])

  // Stream output line by line with delay
  const streamOutput = useCallback(async (lines: string[], type: 'output' | 'success' | 'error') => {
    for (const line of lines) {
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20))
      addOutput(type, line)
    }
  }, [addOutput])

  const executeCommand = useCallback(async (cmd: string) => {
    if (!cmd.trim()) return

    const startTime = performance.now()

    // Add command to history
    addOutput('input', `${prompt} ${cmd}`)
    setCommandHistory(prev => [...prev.filter(c => c !== cmd), cmd])
    setHistoryIndex(-1)
    setInput('')
    setIsExecuting(true)

    try {
      if (onCommand) {
        const result = await onCommand(cmd)
        const latency = performance.now() - startTime

        await streamOutput(result.output, result.success ? 'output' : 'error')

        // Add execution summary
        addOutput(
          result.success ? 'success' : 'error',
          `[${result.success ? 'OK' : 'FAIL'}] Completed in ${formatLatency(latency)}`
        )
      } else {
        // Default mock response
        await streamOutput(
          [`Command received: ${cmd}`, 'No handler configured'],
          'output'
        )
      }
    } catch (err) {
      addOutput('error', `Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsExecuting(false)
    }
  }, [onCommand, prompt, addOutput, streamOutput])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isExecuting) {
      executeCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      if (isExecuting) {
        setIsExecuting(false)
        addOutput('error', '^C')
      }
    }
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <GlassSurfaceContainer className={cn('flex flex-col', className)} padding="none">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-2 text-body-sm text-text-muted font-mono">{title}</span>
      </div>

      {/* Output area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed min-h-[200px] max-h-[400px]"
        onClick={focusInput}
      >
        {history.map(entry => (
          <div
            key={entry.id}
            className={cn(
              'whitespace-pre-wrap break-all',
              entry.type === 'input' && 'text-text-primary',
              entry.type === 'output' && 'text-text-secondary pl-4',
              entry.type === 'error' && 'text-red-400 pl-4',
              entry.type === 'success' && 'text-accent pl-4'
            )}
          >
            {entry.content}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-accent">{prompt}</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isExecuting}
              className={cn(
                'w-full bg-transparent outline-none text-text-primary caret-accent',
                isExecuting && 'opacity-50'
              )}
              aria-label="Terminal input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {/* Blinking cursor when empty and focused */}
            {!input && !isExecuting && (
              <span className="absolute left-0 top-0 w-2 h-5 bg-accent/80 animate-pulse" />
            )}
          </div>
          {isExecuting && (
            <span className="text-text-muted text-xs">executing...</span>
          )}
        </div>
      </div>

      {/* Footer with hints */}
      <div className="px-4 py-2 border-t border-border text-xs text-text-muted font-mono flex gap-4">
        <span>↑↓ history</span>
        <span>Enter execute</span>
        <span>Ctrl+C cancel</span>
      </div>
    </GlassSurfaceContainer>
  )
}
