'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from '@/components/ui/icons'
import { MobileDetailSheet } from '@/components/ui/mobile-detail-sheet'
import type { ServiceModule } from '@/lib/homepage-content'
import styles from './homepage.module.css'

type MobileCapabilityIndexProps = {
  items: readonly ServiceModule[]
  className?: string
}

export function MobileCapabilityIndex({
  items,
  className,
}: MobileCapabilityIndexProps) {
  const [selected, setSelected] = useState<ServiceModule | null>(null)
  const selectedIndex = selected
    ? items.findIndex((item) => item.id === selected.id)
    : -1

  return (
    <div className={className} data-mobile-capability-index>
      <ol className={styles.mobileCapabilityList} aria-label="Mobile capability index">
        {items.map((item, index) => (
          <li key={item.id} data-material={item.material}>
            <button
              type="button"
              className={styles.mobileCapabilityTrigger}
              onClick={() => setSelected(item)}
              aria-haspopup="dialog"
            >
              <span className={styles.mobileCapabilityNumber} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.mobileCapabilityCopy}>
                <strong>{item.title}</strong>
                <span>{item.scope}</span>
              </span>
              <span className={styles.mobileCapabilityAffordance} aria-hidden="true">
                <span>Brief</span>
                <ArrowRight size={16} />
              </span>
            </button>
          </li>
        ))}
      </ol>

      <MobileDetailSheet
        open={selected !== null}
        onClose={() => setSelected(null)}
        eyebrow={
          selected
            ? `Capability ${String(selectedIndex + 1).padStart(2, '0')} · ${selected.scope}`
            : undefined
        }
        title={selected?.title ?? ''}
        footer={
          selected ? (
            <Link href={selected.href} className={styles.mobileCapabilitySheetAction}>
              <span>Discuss this capability</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ) : undefined
        }
      >
        {selected ? (
          <p className={styles.mobileCapabilityDescription}>{selected.description}</p>
        ) : null}
      </MobileDetailSheet>
    </div>
  )
}
