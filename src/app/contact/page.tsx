'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Input, Textarea, CheckCircle, AlertCircle, Loader, PageTransition } from '@/components/ui'
import { contactContent, contactPageContent, siteConfig } from '@/lib/content'
import { fadeUp, staggerContainer, staggerContainerFast, viewportOnce } from '@/lib/motion'

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

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  // Load reCAPTCHA v3 script
  useEffect(() => {
    if (!recaptchaSiteKey) return
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`
    script.async = true
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [recaptchaSiteKey])

  const getRecaptchaToken = useCallback(async (): Promise<string | null> => {
    if (!recaptchaSiteKey) return null
    try {
      await new Promise<void>((resolve) => {
        if (window.grecaptcha?.ready) {
          window.grecaptcha.ready(() => resolve())
        } else {
          resolve()
        }
      })
      return await window.grecaptcha.execute(recaptchaSiteKey, { action: 'contact_form' })
    } catch {
      return null
    }
  }, [recaptchaSiteKey])

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
      const recaptchaToken = await getRecaptchaToken()

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          recaptchaToken,
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
    <PageTransition>
      {/* Hero + Form — merged into one section, no separate hero block */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-48 md:pb-32 relative z-10">
        <div className="container-main">
          {/* Inline headline — no separate hero section */}
          <motion.div
            className="mb-12 sm:mb-16 md:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-16 items-end"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={fadeUp} className="font-display text-[2.25rem] sm:text-display-lg md:text-display-xl font-semibold lg:col-span-7">
              {hero.headline}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base sm:text-body-lg text-text-secondary leading-relaxed lg:col-span-5">
              {hero.description}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
            {/* Form */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative p-5 sm:p-8 md:p-10 rounded-lg bg-bg-secondary border border-border overflow-hidden">

                {formState === 'success' ? (
                  <div className="relative text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-ultraviolet/20 flex items-center justify-center">
                      <CheckCircle size={32} className="text-violet-light" />
                    </div>
                    <h2 className="text-display-sm font-display font-semibold mb-3">
                      {success.title}
                    </h2>
                    <p className="text-body-md text-text-secondary mb-8">
                      {success.description}
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-5 py-2.5 min-h-[44px] border border-violet-light/30 text-violet-light font-medium rounded-sm hover:bg-ultraviolet/10 active:bg-ultraviolet/10 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : formState === 'error' ? (
                  <div className="relative text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertCircle size={32} className="text-red-400" />
                    </div>
                    <h2 className="text-display-sm font-display font-semibold mb-3">
                      {error.title}
                    </h2>
                    <p className="text-body-md text-text-secondary mb-8">
                      {error.description}
                    </p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="px-5 py-2.5 min-h-[44px] border border-border text-text-primary font-medium rounded-sm hover:border-violet-light/30 active:border-violet-light/30 transition-colors"
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
                        autoComplete="name"
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
                        autoComplete="email"
                        inputMode="email"
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
                      autoComplete="organization"
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
                      className="cta-primary disabled:opacity-50 disabled:pointer-events-none"
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
            </motion.div>

            {/* Contact Info — clean, no card wrappers */}
            <motion.div
              className="lg:col-span-4 lg:col-start-9 lg:pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="space-y-8">
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
                    {info.title}
                  </h2>
                  <div className="text-body-sm text-text-muted mb-1.5">Email</div>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-base sm:text-heading-md font-medium text-text-primary hover:text-violet-light transition-colors break-all"
                  >
                    {siteConfig.email}
                  </a>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="text-body-sm text-text-muted mb-1.5">Response Time</div>
                  <p className="text-body-md text-text-primary">
                    Within one business day.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 md:py-36 bg-bg-secondary/50 border-t border-border">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6 }}
            >
              <div className="lg:sticky lg:top-32">
                <h2 className="text-xs font-mono uppercase tracking-widest text-violet-light mb-4">
                  {contactPageContent.faq.title}
                </h2>
                <p className="text-[1.75rem] sm:text-display-sm font-display font-semibold">
                  Before you reach out
                </p>
              </div>
            </motion.div>

            <div className="lg:col-span-7 lg:col-start-6">
              <motion.div
                className="space-y-8"
                variants={staggerContainerFast}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                {contactPageContent.faq.items.map((item, index) => (
                  <motion.div
                    key={item.question}
                    className="group"
                    variants={fadeUp}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono text-text-muted pt-1">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-heading-sm font-semibold text-text-primary mb-3 group-hover:text-violet-light transition-colors">
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
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
