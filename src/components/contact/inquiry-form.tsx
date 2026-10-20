'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { SlabButton } from '@/components/site'
import {
  composeInquiryMessage,
  contactPageContent,
  deliveryStages,
  fieldLimits,
} from '@/lib/contact-content'
import type { DeliveryStage } from '@/lib/contact-content'
import styles from './contact.module.css'

/*
 * The three-step inquiry (spec 02-contact / 01-contact-ph). The steps are
 * presentation only: every answer lives in one form, and the send is the same
 * POST /api/contact the previous page made, with the same reCAPTCHA v3 flow
 * and the same body (name, email, company, message, recaptchaToken). The
 * platform answers and the decision are composed into `message`. The sent
 * state is shown only after the API answers ok.
 */

const { steps, you, platform, decision, actions, errors: copy, sent, failure } = contactPageContent

type Step = 0 | 1 | 2 | 3
type SendState = 'idle' | 'submitting' | 'error'

interface Values {
  name: string
  company: string
  email: string
  stage: DeliveryStage
  platform: string
  decision: string
  when: string
}

type FieldName = 'name' | 'company' | 'email' | 'platform' | 'decision'
type Errors = Partial<Record<FieldName, string>>

const empty: Values = {
  name: '',
  company: '',
  email: '',
  stage: deliveryStages[0],
  platform: '',
  decision: '',
  when: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(step: Step, v: Values): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (!v.name.trim()) e.name = copy.name
    if (!v.company.trim()) e.company = copy.company
    if (!v.email.trim()) e.email = copy.email
    else if (!emailPattern.test(v.email.trim())) e.email = copy.emailInvalid
  }
  if (step === 1 && !v.platform.trim()) e.platform = copy.platform
  if (step === 2) {
    if (!v.decision.trim()) e.decision = copy.decision
    else if (v.decision.trim().length < 10) e.decision = copy.decisionShort
  }
  return e
}

/* Field order, so the first error in a step takes focus. */
const fieldOrder: FieldName[] = ['name', 'company', 'email', 'platform', 'decision']

export function InquiryForm() {
  const [step, setStep] = useState<Step>(0)
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [sendState, setSendState] = useState<SendState>('idle')
  const [firstName, setFirstName] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const stageButtons = useRef<Array<HTMLButtonElement | null>>([])
  const focusOnStep = useRef(false)

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
   * static, and only an empty decision is filled. Whitespace is collapsed and
   * the value capped so a hand-edited URL cannot dump a wall of text in.
   */
  useEffect(() => {
    const program = new URLSearchParams(window.location.search)
      .get('program')
      ?.replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120)
    if (!program) return
    setValues((prev) => (prev.decision ? prev : { ...prev, decision: `Regarding: ${program}. ` }))
  }, [])

  /* Each step change moves focus to the new step's heading (not on load). */
  useEffect(() => {
    if (!focusOnStep.current) return
    focusOnStep.current = false
    formRef.current
      ?.querySelector<HTMLElement>(`[data-step="${step}"] h2`)
      ?.focus({ preventScroll: true })
  }, [step])

  const goTo = useCallback((next: Step) => {
    focusOnStep.current = true
    setErrors({})
    setStep(next)
  }, [])

  const getRecaptchaToken = useCallback(async (): Promise<string | null> => {
    if (!recaptchaSiteKey) return null
    try {
      await new Promise<void>((resolve) => {
        if (window.grecaptcha?.ready) window.grecaptcha.ready(() => resolve())
        else resolve()
      })
      return await window.grecaptcha.execute(recaptchaSiteKey, { action: 'contact_form' })
    } catch {
      return null
    }
  }, [recaptchaSiteKey])

  const send = async () => {
    setSendState('submitting')
    try {
      const recaptchaToken = await getRecaptchaToken()
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          message: composeInquiryMessage(values),
          recaptchaToken,
        }),
      })
      if (!response.ok) throw new Error('Failed to send message')
      setFirstName(values.name.trim().split(/\s+/)[0] ?? '')
      setSendState('idle')
      goTo(3)
    } catch (err) {
      console.error('Contact form error:', err)
      setSendState('error')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step === 3 || sendState === 'submitting') return
    const found = validate(step, values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      const first = fieldOrder.find((f) => found[f])
      if (first) window.requestAnimationFrame(() => document.getElementById(`inquiry-${first}`)?.focus())
      return
    }
    if (step < 2) goTo((step + 1) as Step)
    else void send()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name as FieldName]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const pickStage = (stage: DeliveryStage) => setValues((prev) => ({ ...prev, stage }))

  const onStageKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    let next: number | undefined
    if (delta) next = (index + delta + deliveryStages.length) % deliveryStages.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = deliveryStages.length - 1
    if (next === undefined) return
    event.preventDefault()
    pickStage(deliveryStages[next])
    stageButtons.current[next]?.focus()
  }

  const restart = () => {
    setValues(empty)
    setFirstName('')
    setSendState('idle')
    goTo(0)
  }

  /* Shared props for a text field: label, error wiring, limits. */
  const field = (name: FieldName | 'when') => {
    const error = name === 'when' ? undefined : errors[name]
    return {
      id: `inquiry-${name}`,
      name,
      value: values[name],
      onChange,
      maxLength: fieldLimits[name],
      'aria-invalid': error ? (true as const) : undefined,
      'aria-describedby': error ? `inquiry-${name}-error` : undefined,
    }
  }

  const errorText = (name: FieldName) =>
    errors[name] ? (
      <p id={`inquiry-${name}-error`} className={styles.fieldError}>
        {errors[name]}
      </p>
    ) : null

  const stepClass = (i: Step) => [styles.step, step === i ? styles.stepOn : ''].filter(Boolean).join(' ')
  const heading = { tabIndex: -1, className: styles.stepTitle }

  const submitting = sendState === 'submitting'

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Inquiry">
      <ol className={styles.progress} aria-label="Inquiry steps">
        {steps.map((s, i) => {
          const done = i < step && step < 3
          return (
            <li key={s.long}>
              <button
                type="button"
                className={[styles.progressStep, i <= step ? styles.progressOn : '', done ? styles.progressDone : '']
                  .filter(Boolean)
                  .join(' ')}
                tabIndex={done ? 0 : -1}
                aria-disabled={done ? undefined : true}
                aria-current={i === step ? 'step' : undefined}
                onClick={() => {
                  if (done) goTo(i as Step)
                }}
              >
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span className={styles.progressLong}>{s.long}</span>
                <span className={styles.progressShort}>{s.short}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className={styles.vh} aria-live="polite">
        {step === 3 ? sent.status : `Step ${step + 1} of 3`}
      </p>

      <div className={styles.stack}>
        <div className={stepClass(0)} inert={step !== 0} data-step="0">
          <h2 {...heading}>{you.title}</h2>
          <p className={styles.stepHint}>{you.hint}</p>
          <div className={styles.fields}>
            <div className={`${styles.field} ${styles.half}`}>
              <label htmlFor="inquiry-name">{you.nameLabel}</label>
              <input {...field('name')} type="text" autoComplete="name" placeholder={you.namePlaceholder} aria-required="true" />
              {errorText('name')}
            </div>
            <div className={`${styles.field} ${styles.half}`}>
              <label htmlFor="inquiry-company">{you.companyLabel}</label>
              <input
                {...field('company')}
                type="text"
                autoComplete="organization"
                placeholder={you.companyPlaceholder}
                aria-required="true"
              />
              {errorText('company')}
            </div>
            <div className={styles.field}>
              <label htmlFor="inquiry-email">{you.emailLabel}</label>
              <input
                {...field('email')}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={you.emailPlaceholder}
                aria-required="true"
              />
              {errorText('email')}
            </div>
          </div>
        </div>

        <div className={stepClass(1)} inert={step !== 1} data-step="1">
          <h2 {...heading}>{platform.title}</h2>
          <p className={styles.stepHint}>{platform.hint}</p>
          <div className={styles.fields}>
            <div className={styles.field}>
              <p className={styles.groupLabel} id="inquiry-stage-label">
                {platform.stageLabel}
              </p>
              <div className={styles.seg} role="radiogroup" aria-labelledby="inquiry-stage-label">
                {deliveryStages.map((stage, i) => {
                  const on = values.stage === stage
                  return (
                    <button
                      key={stage}
                      ref={(el) => {
                        stageButtons.current[i] = el
                      }}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      tabIndex={on ? 0 : -1}
                      onClick={() => pickStage(stage)}
                      onKeyDown={(e) => onStageKey(e, i)}
                    >
                      <b aria-hidden="true">{String(i + 1).padStart(2, '0')}</b>
                      {stage}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="inquiry-platform">{platform.platformLabel}</label>
              <input {...field('platform')} type="text" placeholder={platform.platformPlaceholder} aria-required="true" />
              {errorText('platform')}
            </div>
          </div>
        </div>

        <div className={stepClass(2)} inert={step !== 2} data-step="2">
          <h2 {...heading}>{decision.title}</h2>
          <p className={styles.stepHint}>{decision.hint}</p>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="inquiry-decision">{decision.decisionLabel}</label>
              <textarea
                {...field('decision')}
                rows={3}
                placeholder={decision.decisionPlaceholder}
                aria-required="true"
                className={styles.decision}
              />
              {errorText('decision')}
            </div>
            <div className={styles.field}>
              <label htmlFor="inquiry-when">
                {decision.whenLabel}
                <em>{decision.whenOptional}</em>
              </label>
              <input {...field('when')} type="text" placeholder={decision.whenPlaceholder} />
            </div>
          </div>
        </div>

        <div className={`${stepClass(3)} ${styles.sent}`} inert={step !== 3} data-step="3">
          <p className={styles.ok}>{sent.status}</p>
          <h2 {...heading}>{firstName ? sent.titleNamed(firstName) : sent.title}</h2>
          <p className={styles.stepHint}>{sent.hint}</p>
          <ol className={styles.next}>
            {sent.next.map((line, i) => (
              <li key={line}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                {line}
              </li>
            ))}
          </ol>
          <button type="button" className={styles.again} onClick={restart}>
            {sent.again}
          </button>
        </div>
      </div>

      {step < 3 ? (
        <>
          {sendState === 'error' ? (
            <p className={styles.failure} role="alert">
              <strong>{failure.title}</strong> {failure.description}
            </p>
          ) : null}
          <div className={styles.foot}>
            <div className={styles.go}>
              <SlabButton type="submit" block arrow={step === 2 ? '↗' : '→'} disabled={submitting}>
                {step === 2 ? (submitting ? actions.sending : actions.send) : actions.continue}
              </SlabButton>
            </div>
            <button
              type="button"
              className={styles.back}
              hidden={step === 0}
              onClick={() => {
                if (step > 0) goTo((step - 1) as Step)
              }}
            >
              <span aria-hidden="true">← </span>
              {actions.back}
            </button>
          </div>
        </>
      ) : null}
    </form>
  )
}
