'use client'

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="space-y-1.5 sm:space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 min-h-[48px] bg-bg-secondary border border-border rounded-sm',
            'text-[16px] sm:text-body-md text-text-primary placeholder:text-text-muted',
            'transition-all duration-200',
            'focus:outline-none focus:border-[color:var(--focus-ring-color)] focus:ring-1 focus:ring-[color:var(--focus-ring-color)]',
            'hover:border-border-accent',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-body-sm text-red-400 mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="space-y-1.5 sm:space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 bg-bg-secondary border border-border rounded-sm',
            'text-[16px] sm:text-body-md text-text-primary placeholder:text-text-muted',
            'transition-all duration-200 resize-none',
            'focus:outline-none focus:border-[color:var(--focus-ring-color)] focus:ring-1 focus:ring-[color:var(--focus-ring-color)]',
            'hover:border-border-accent',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          rows={5}
          {...props}
        />
        {error && (
          <p className="text-body-sm text-red-400 mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
