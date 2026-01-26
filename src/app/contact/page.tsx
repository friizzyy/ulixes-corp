'use client'

import { useState } from 'react'
import { Input, Textarea, CheckCircle, AlertCircle, Loader } from '@/components/ui'
import { contactContent, contactPageContent, siteConfig } from '@/lib/content'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FormErrors {
  name?: string
  email?: string
  company?: string
  message?: string
}

export default function ContactPage() {
  const { hero, form, success, error, info } = contactContent

  const [formState, setFormState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setFormState('submitting')

    try {
      // Using Formspree for form handling - replace YOUR_FORM_ID with your Formspree form ID
      // Sign up at https://formspree.io and create a form to get your ID
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          _subject: `New inquiry from ${formData.name} - Ulixes Corporation`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setFormState('success')
    } catch (err) {
      console.error('Contact form error:', err)
      setFormState('error')
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', company: '', message: '' })
    setFormState('idle')
    setErrors({})
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <div className="container-main">
          <div className="max-w-4xl">
            <div className="section-label">Contact</div>
            <h1 className="text-display-lg md:text-display-xl font-bold mb-6">
              {hero.headline}
            </h1>
            <p className="text-body-lg md:text-body-xl text-text-secondary leading-relaxed max-w-2xl">
              {hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="pb-24 md:pb-32">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="relative p-8 md:p-10 rounded-lg bg-gradient-to-br from-surface via-bg-secondary to-surface border border-border overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

                {formState === 'success' ? (
                  <div className="relative text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle size={32} className="text-accent" />
                    </div>
                    <h2 className="text-display-sm font-bold mb-3">
                      {success.title}
                    </h2>
                    <p className="text-body-md text-text-secondary mb-8">
                      {success.description}
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-5 py-2.5 border border-accent/30 text-accent font-medium rounded-sm hover:bg-accent/10 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : formState === 'error' ? (
                  <div className="relative text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertCircle size={32} className="text-red-400" />
                    </div>
                    <h2 className="text-display-sm font-bold mb-3">
                      {error.title}
                    </h2>
                    <p className="text-body-md text-text-secondary mb-8">
                      {error.description}
                    </p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="px-5 py-2.5 border border-border text-text-primary font-medium rounded-sm hover:border-accent/30 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label={form.nameLabel}
                        name="name"
                        placeholder={form.namePlaceholder}
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                        disabled={formState === 'submitting'}
                        required
                      />
                      <Input
                        label={form.emailLabel}
                        name="email"
                        type="email"
                        placeholder={form.emailPlaceholder}
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        disabled={formState === 'submitting'}
                        required
                      />
                    </div>
                    <Input
                      label={form.companyLabel}
                      name="company"
                      placeholder={form.companyPlaceholder}
                      value={formData.company}
                      onChange={handleInputChange}
                      error={errors.company}
                      disabled={formState === 'submitting'}
                    />
                    <Textarea
                      label={form.messageLabel}
                      name="message"
                      placeholder={form.messagePlaceholder}
                      value={formData.message}
                      onChange={handleInputChange}
                      error={errors.message}
                      disabled={formState === 'submitting'}
                      required
                    />
                    <button
                      type="submit"
                      disabled={formState === 'submitting'}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-sm hover:shadow-glow transition-shadow disabled:opacity-50"
                    >
                      {formState === 'submitting' ? (
                        <>
                          <Loader className="text-bg-primary" />
                          {form.submittingLabel}
                        </>
                      ) : (
                        form.submitLabel
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-4 lg:col-start-9 space-y-6">
              {/* Direct Contact */}
              <div className="relative p-8 rounded-lg bg-bg-secondary border border-border overflow-hidden">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-accent/5 rounded-full blur-2xl" />

                <div className="relative">
                  <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-6">
                    {info.title}
                  </h2>
                  <div>
                    <div className="text-body-sm text-text-muted mb-2">Email</div>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-heading-md font-medium text-text-primary hover:text-accent transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="p-6 rounded-lg bg-surface/50 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-body-sm text-text-muted">Response Time</span>
                </div>
                <p className="text-body-md text-text-secondary">
                  A partner will respond within one business day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-bg-secondary/50 border-t border-border">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                  {contactPageContent.faq.title}
                </h2>
                <p className="text-display-sm font-bold">
                  Before you reach out
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <div className="space-y-8">
                {contactPageContent.faq.items.map((item, index) => (
                  <div
                    key={item.question}
                    className="group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono text-text-muted pt-1">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-heading-sm font-semibold text-text-primary mb-3 group-hover:text-accent transition-colors">
                          {item.question}
                        </h3>
                        <p className="text-body-md text-text-secondary leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                    {index < contactPageContent.faq.items.length - 1 && (
                      <div className="mt-8 h-px bg-border ml-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
