'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Textarea, CheckCircle, AlertCircle, Loader } from '@/components/ui'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 relative z-10">
        <motion.div
          className="container-main"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="max-w-3xl" variants={fadeUp}>
            <div className="section-label">Contact</div>
            <h1 className="text-display-md md:text-display-lg font-bold mb-4">
              {hero.headline}
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              {hero.description}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Form + Info */}
      <section className="py-16 md:py-24">
        <motion.div
          className="container-main"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">
            {/* Form */}
            <div className="p-8 md:p-10 rounded-md bg-bg-secondary border border-border">
              <AnimatePresence mode="wait">
                {formState === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle size={28} className="text-accent" />
                    </div>
                    <h2 className="text-heading-lg font-semibold mb-2">
                      {success.title}
                    </h2>
                    <p className="text-body-md text-text-secondary mb-6">
                      {success.description}
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-5 py-2.5 bg-surface border border-border text-text-primary font-medium rounded-sm hover:border-border-accent transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : formState === 'error' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertCircle size={28} className="text-red-400" />
                    </div>
                    <h2 className="text-heading-lg font-semibold mb-2">
                      {error.title}
                    </h2>
                    <p className="text-body-md text-text-secondary mb-6">
                      {error.description}
                    </p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="px-5 py-2.5 bg-surface border border-border text-text-primary font-medium rounded-sm hover:border-border-accent transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
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
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-md bg-bg-secondary border border-border">
                <h2 className="text-heading-sm font-semibold mb-5">
                  {info.title}
                </h2>
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">
                      Email
                    </div>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-body-md text-text-primary hover:text-accent transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-bg-secondary/30 border-t border-border">
        <motion.div
          className="container-main"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="max-w-3xl">
            <div className="section-label">{contactPageContent.faq.title}</div>
            <div className="space-y-6 mt-8">
              {contactPageContent.faq.items.map((item) => (
                <div key={item.question}>
                  <h3 className="text-heading-sm font-semibold text-text-primary mb-2">
                    {item.question}
                  </h3>
                  <p className="text-body-md text-text-secondary leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
