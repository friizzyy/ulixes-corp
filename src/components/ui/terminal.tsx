'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TerminalLine {
  type: 'command' | 'output' | 'success' | 'processing' | 'prompt' | 'error'
  text: string
  delay?: number
}

interface TerminalProps {
  lines: TerminalLine[]
  className?: string
  typingSpeed?: number
}

export function Terminal({ lines, className, typingSpeed = 30 }: TerminalProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })

  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [currentText, setCurrentText] = useState<string>('')
  const [isTyping, setIsTyping] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [processingComplete, setProcessingComplete] = useState<Set<number>>(new Set())

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Typing animation
  useEffect(() => {
    if (!isInView) return

    if (prefersReducedMotion) {
      setVisibleLines(lines.length)
      setCurrentText('')
      const allIndexes = new Set(lines.map((_, i) => i))
      setProcessingComplete(allIndexes)
      return
    }

    if (visibleLines >= lines.length) return

    const currentLine = lines[visibleLines]
    const isCommand = currentLine.type === 'command' || currentLine.type === 'prompt'
    const lineDelay = currentLine.delay || (isCommand ? 300 : 150)

    const startTimeout = setTimeout(() => {
      if (isCommand) {
        // Type character by character for commands
        setIsTyping(true)
        let charIndex = 0
        const cleanText = currentLine.text.replace('$ ', '')

        const typeInterval = setInterval(() => {
          if (charIndex <= cleanText.length) {
            setCurrentText(cleanText.slice(0, charIndex))
            charIndex++
          } else {
            clearInterval(typeInterval)
            setIsTyping(false)
            setTimeout(() => {
              setVisibleLines(prev => prev + 1)
              setCurrentText('')
            }, 200)
          }
        }, typingSpeed)

        return () => clearInterval(typeInterval)
      } else if (currentLine.type === 'processing') {
        // Show processing, then mark complete after delay
        setVisibleLines(prev => prev + 1)
        setTimeout(() => {
          setProcessingComplete(prev => new Set(prev).add(visibleLines))
        }, 1200)
      } else {
        // Instant reveal for output/success
        setVisibleLines(prev => prev + 1)
      }
    }, visibleLines === 0 ? 800 : lineDelay)

    return () => clearTimeout(startTimeout)
  }, [isInView, visibleLines, lines, typingSpeed, prefersReducedMotion])

  const renderLine = (line: TerminalLine, index: number) => {
    const isCurrentLine = index === visibleLines
    const isPastLine = index < visibleLines
    const isCommand = line.type === 'command' || line.type === 'prompt'
    const cleanText = line.text.replace('$ ', '')

    if (!isPastLine && !isCurrentLine) return null

    const displayText = isCurrentLine && isCommand ? currentText : cleanText

    return (
      <div key={index} className="flex items-start gap-2 min-h-[1.4em]">
        {isCommand && (
          <>
            <span className="text-accent select-none shrink-0">$</span>
            <span className="text-text-primary">
              {displayText}
              {isCurrentLine && isTyping && (
                <span className={cn(
                  'inline-block w-[2px] h-[1em] bg-accent ml-px align-middle translate-y-px',
                  showCursor ? 'opacity-100' : 'opacity-0'
                )} />
              )}
            </span>
          </>
        )}
        {line.type === 'output' && isPastLine && (
          <motion.span
            className="text-text-muted pl-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {line.text}
          </motion.span>
        )}
        {line.type === 'processing' && isPastLine && (
          <motion.span
            className="text-text-secondary pl-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {!processingComplete.has(index) ? (
              <span className="inline-flex gap-[3px] w-4">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className="w-1 h-1 bg-accent rounded-full"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </span>
            ) : (
              <span className="text-accent w-4">OK</span>
            )}
            {line.text}
          </motion.span>
        )}
        {line.type === 'success' && isPastLine && (
          <motion.span
            className="text-accent flex items-center gap-2"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
              <path d="M2 6L4.5 8.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {line.text}
          </motion.span>
        )}
        {line.type === 'error' && isPastLine && (
          <motion.span
            className="text-red-400 pl-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {line.text}
          </motion.span>
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('terminal', className)}>
      <div className="terminal-header">
        <div className="flex items-center gap-1.5">
          <div className="terminal-dot bg-[#ff5f57]" />
          <div className="terminal-dot bg-[#febc2e]" />
          <div className="terminal-dot bg-[#28c840]" />
        </div>
        <span className="ml-auto text-[10px] text-text-muted/60 font-mono tracking-wide">validate.sh</span>
      </div>
      <div className="terminal-body space-y-1 min-h-[100px]">
        {lines.map((line, index) => renderLine(line, index))}
        {/* Resting cursor when all lines complete */}
        {visibleLines >= lines.length && !isTyping && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-accent">$</span>
            <span className={cn(
              'inline-block w-[2px] h-[1em] bg-accent',
              showCursor ? 'opacity-100' : 'opacity-0'
            )} />
          </div>
        )}
      </div>
    </div>
  )
}

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <div className={cn(
      'relative bg-bg-secondary border border-border rounded-lg p-6 md:p-8',
      className
    )}>
      <pre className="font-mono text-body-sm leading-loose overflow-x-auto">
        {children}
      </pre>
    </div>
  )
}

export function CodeComment({ children }: { children: React.ReactNode }) {
  return <span className="text-text-muted">{`// `}{children}</span>
}

export function CodeKeyword({ children }: { children: React.ReactNode }) {
  return <span className="text-purple-400">{children}</span>
}

export function CodeString({ children }: { children: React.ReactNode }) {
  return <span className="text-accent">{children}</span>
}

export function CodeFunction({ children }: { children: React.ReactNode }) {
  return <span className="text-accent-secondary">{children}</span>
}
