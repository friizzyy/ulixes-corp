'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GlassSurfaceContainer } from './GlassSurfaceContainer'

interface CodeBlockLiveProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  maxHeight?: string
  className?: string
}

// Basic syntax highlighting tokens
const tokenize = (code: string, language: string): Array<{ type: string; content: string }> => {
  const tokens: Array<{ type: string; content: string }> = []

  // Keywords by language
  const keywords: Record<string, string[]> = {
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'export', 'import', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'extends', 'implements'],
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'export', 'import', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'extends'],
    python: ['def', 'return', 'if', 'else', 'elif', 'for', 'while', 'class', 'import', 'from', 'try', 'except', 'raise', 'with', 'as', 'lambda', 'yield', 'async', 'await'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'TABLE', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'AS', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT'],
    bash: ['if', 'then', 'else', 'fi', 'for', 'do', 'done', 'while', 'case', 'esac', 'function', 'return', 'export', 'source'],
  }

  const langKeywords = keywords[language] || keywords.typescript

  // Simple tokenizer
  let remaining = code
  while (remaining.length > 0) {
    // Comments
    if (remaining.startsWith('//') || remaining.startsWith('#')) {
      const end = remaining.indexOf('\n')
      const comment = end === -1 ? remaining : remaining.slice(0, end)
      tokens.push({ type: 'comment', content: comment })
      remaining = remaining.slice(comment.length)
      continue
    }

    // Strings
    const stringMatch = remaining.match(/^(['"`])(?:[^\\]|\\.)*?\1/)
    if (stringMatch) {
      tokens.push({ type: 'string', content: stringMatch[0] })
      remaining = remaining.slice(stringMatch[0].length)
      continue
    }

    // Numbers
    const numberMatch = remaining.match(/^\d+\.?\d*/)
    if (numberMatch) {
      tokens.push({ type: 'number', content: numberMatch[0] })
      remaining = remaining.slice(numberMatch[0].length)
      continue
    }

    // Keywords and identifiers
    const wordMatch = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/)
    if (wordMatch) {
      const word = wordMatch[0]
      const type = langKeywords.includes(word) ? 'keyword' : 'identifier'
      tokens.push({ type, content: word })
      remaining = remaining.slice(word.length)
      continue
    }

    // Operators and punctuation
    const opMatch = remaining.match(/^[+\-*/%=<>!&|^~?:;.,()[\]{}]+/)
    if (opMatch) {
      tokens.push({ type: 'punctuation', content: opMatch[0] })
      remaining = remaining.slice(opMatch[0].length)
      continue
    }

    // Whitespace
    const wsMatch = remaining.match(/^\s+/)
    if (wsMatch) {
      tokens.push({ type: 'whitespace', content: wsMatch[0] })
      remaining = remaining.slice(wsMatch[0].length)
      continue
    }

    // Fallback: single character
    tokens.push({ type: 'text', content: remaining[0] })
    remaining = remaining.slice(1)
  }

  return tokens
}

const tokenColors: Record<string, string> = {
  keyword: 'text-purple-400',
  string: 'text-emerald-400',
  number: 'text-amber-400',
  comment: 'text-text-muted italic',
  identifier: 'text-text-primary',
  punctuation: 'text-text-secondary',
  whitespace: '',
  text: 'text-text-primary',
}

export function CodeBlockLive({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  highlightLines = [],
  maxHeight = '400px',
  className,
}: CodeBlockLiveProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setCopyError(false)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      setCopyError(true)
      setTimeout(() => setCopyError(false), 2000)
    }
  }, [code])

  const lines = code.split('\n')
  const tokens = tokenize(code, language)

  // Group tokens by line
  const lineTokens: Array<Array<{ type: string; content: string }>> = [[]]
  let lineIndex = 0
  for (const token of tokens) {
    if (token.type === 'whitespace' && token.content.includes('\n')) {
      const parts = token.content.split('\n')
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) {
          lineTokens[lineIndex].push({ type: 'whitespace', content: parts[i] })
        }
        if (i < parts.length - 1) {
          lineIndex++
          lineTokens[lineIndex] = []
        }
      }
    } else {
      lineTokens[lineIndex].push(token)
    }
  }

  return (
    <GlassSurfaceContainer className={cn('overflow-hidden', className)} padding="none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {filename && (
            <span className="text-xs text-text-muted font-mono">{filename}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-text-muted hover:text-text-primary bg-surface hover:bg-surface-hover rounded transition-colors"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-emerald-400"
                >
                  ✓ Copied
                </motion.span>
              ) : copyError ? (
                <motion.span
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-red-400"
                >
                  Failed
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  Copy
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Code content */}
      <div
        className="overflow-auto font-mono text-sm leading-relaxed"
        style={{ maxHeight }}
      >
        <table className="w-full border-collapse">
          <tbody>
            {lineTokens.map((tokens, lineNum) => {
              const isHighlighted = highlightLines.includes(lineNum + 1)
              return (
                <tr
                  key={lineNum}
                  className={cn(
                    'transition-colors',
                    isHighlighted && 'bg-accent/10'
                  )}
                >
                  {showLineNumbers && (
                    <td className="px-4 py-0.5 text-right text-text-muted select-none border-r border-border/50 w-12">
                      {lineNum + 1}
                    </td>
                  )}
                  <td className="px-4 py-0.5 whitespace-pre">
                    {tokens.map((token, i) => (
                      <span key={i} className={tokenColors[token.type]}>
                        {token.content}
                      </span>
                    ))}
                    {tokens.length === 0 && '\u00A0'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </GlassSurfaceContainer>
  )
}
