'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
} from '@/components/ui/icons'
import {
  Cascade,
  CascadeItem,
  Curtain,
  Lift,
} from '@/components/motion/editorial-motion'
import { contactPageContent } from '@/lib/contact-content'
import styles from './contact.module.css'

/*
 * Rebuilt on the editorial system. Every "Discuss a mandate" action on the
 * homepage, expertise, and experience pages lands here, and this page was the
 * last one still on the old dark theme, so the primary conversion path changed
 * identity halfway through.
 *
 * The submission logic is carried over unchanged on purpose: the same four
 * fields, the same reCAPTCHA v3 flow, and the same POST body that
 * /api/contact already reads. Only the presentation and the copy are new.
 */

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FormErrors {
  name?: string
  email?: string
  company?: string
  message?: string
}

const { header, practitioner, direct, form, success, error } = contactPageContent


export function ContactPage() {
  const [formState, setFormState] = useState<FormState>('idle')
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (formState === 'success') successHeadingRef.current?.focus()
  }, [formState])
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

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

  /*
   * "Discuss this program" on /nasdaq-calypso lands here as
   * /contact?program=<name>. The name is read after mount so the page stays
   * static, and only an empty message is filled: a draft the visitor has
   * already started is theirs. Whitespace is collapsed and the value capped so
   * a hand-edited URL cannot dump a wall of text into the field.
   */
  useEffect(() => {
    const program = new URLSearchParams(window.location.search)
      .get('program')
      ?.replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120)
    if (!program) return
    setFormData((prev) =>
      prev.message ? prev : { ...prev, message: `Regarding: ${program}. ` },
    )
  }, [])

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
      return await window.grecaptcha.execute(recaptchaSiteKey, {
        action: 'contact_form',
      })
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateForm()) {
      /* Move focus to the first field in error so the mistake is announced. */
      window.requestAnimationFrame(() => {
        const invalid = document.querySelector<HTMLElement>(
          '[aria-invalid="true"]',
        )
        invalid?.focus()
      })
      return
    }

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
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', company: '', message: '' })
    setErrors({})
    setFormState('idle')
  }

  return (
    <div className={styles.page} data-surface="editorial">
      <section className={styles.stage} aria-labelledby="contact-title">
        {/*
          One contained panel rather than a page of stacked sections, with the
          form on its own surface inside it. Two soft elevations, no hard
          borders, and the whole exchange visible without scrolling.
        */}
        <div className={styles.panel} data-mobile-layout="flat">
          <div className={styles.introHead}>
            <p className={`ed-eyebrow ${styles.eyebrow}`}>{header.eyebrow}</p>
            <Curtain className="ed-curtain" delay={0.05}>
              <h1
                id="contact-title"
                className={styles.title}
                aria-label={`${header.headlineLead} ${header.headlineRest}`}
              >
                <strong>
                  {header.headlineLead}{' '}
                </strong>
                {header.headlineRest}
              </h1>
            </Curtain>
            <p className={styles.lead}>{header.body}</p>
          </div>

          <section
            className={styles.introDetails}
            aria-label="Direct contact options"
          >
            <Lift delay={0.28} amount={0}>
              <div className={styles.who}>
                <p className={styles.microLabel}>{practitioner.label}</p>
                <p className={styles.whoName}>{practitioner.name}</p>
                <p className={styles.whoNote}>{practitioner.note}</p>
              </div>
            </Lift>

            <Cascade className={styles.channels} amount={0}>
              <CascadeItem>
                <span className={styles.channelText}>
                  <span className={styles.channelLabel}>
                    {direct.emailLabel}
                  </span>
                  <a href={`mailto:${direct.email}`}>{direct.email}</a>
                </span>
              </CascadeItem>
              <CascadeItem>
                <span className={styles.channelText}>
                  <span className={styles.channelLabel}>
                    {direct.phoneLabel}
                  </span>
                  <a href={`tel:${direct.phone.replace(/[^+\d]/g, '')}`}>
                    {direct.phone}
                  </a>
                </span>
              </CascadeItem>
            </Cascade>
          </section>

          <div className={styles.card}>
            {formState === 'success' ? (
              <div className={styles.state} role="status">
                <span className={styles.stateIcon} aria-hidden="true">
                  <CheckCircle size={22} />
                </span>
                <h2 ref={successHeadingRef} tabIndex={-1} className={styles.stateTitle}>
                  {success.title}
                </h2>
                <p className={styles.stateBody}>{success.description}</p>
                <button
                  type="button"
                  className={styles.stateAction}
                  onClick={resetForm}
                >
                  {success.resetLabel}
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                  <label htmlFor="name">{form.nameLabel}</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={form.namePlaceholder}
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name ? (
                    <p id="name-error" className={styles.fieldError}>
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">{form.emailLabel}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={form.emailPlaceholder}
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email ? (
                    <p id="email-error" className={styles.fieldError}>
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label htmlFor="company">
                    {form.companyLabel}{' '}
                    <span className={styles.optional}>
                      {form.companyOptional}
                    </span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder={form.companyPlaceholder}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="message">{form.messageLabel}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={form.messagePlaceholder}
                    aria-invalid={errors.message ? 'true' : undefined}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message ? (
                    <p id="message-error" className={styles.fieldError}>
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                {formState === 'error' ? (
                  <p className={styles.formError} role="alert">
                    <span aria-hidden="true">
                      <AlertCircle size={17} />
                    </span>
                    <span>
                      <strong>{error.title}</strong> {error.description}
                    </span>
                  </p>
                ) : null}

                <button
                  type="submit"
                  className={`ed-primary ${styles.submit}`}
                  disabled={formState === 'submitting'}
                >
                  <span>
                    {formState === 'submitting'
                      ? form.submittingLabel
                      : form.submitLabel}
                  </span>
                  <span className={styles.actionChamber} aria-hidden="true">
                    <ArrowUpRight size={17} />
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
