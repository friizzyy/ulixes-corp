'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'
import type { HomeService } from '@/lib/homepage-content'
import styles from './services.module.css'

interface ServicesIndexProps {
  items: readonly HomeService[]
}

/*
 * The four service rows. On a pointer that hovers, a small photograph follows
 * the row under the cursor (the spec's .pic); keyboard focus moves it too. On
 * phone each row carries its own thumbnail instead.
 */
export function ServicesIndex({ items }: ServicesIndexProps) {
  const [active, setActive] = useState(0)
  const [top, setTop] = useState<number | null>(null)
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const point = useCallback((index: number) => {
    const row = rowRefs.current[index]
    setActive(index)
    if (row) setTop(row.offsetTop + row.offsetHeight / 2 - 75)
  }, [])

  return (
    <div className={styles.listWrap}>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={item.id}>
            <Link
              ref={(node) => {
                rowRefs.current[index] = node
              }}
              href={item.href}
              className={styles.row}
              onMouseEnter={() => point(index)}
              onFocus={() => point(index)}
            >
              <Image
                src={item.image.src}
                alt=""
                width={item.image.width}
                height={item.image.height}
                sizes="76px"
                className={styles.thumb}
              />
              <span className={styles.txt}>
                <span className={`m ${styles.num}`}>{item.number}</span>
                <span className={styles.name}>{item.title}</span>
              </span>
              <span className={styles.scope}>{item.scope}</span>
              <span className={styles.arrow} aria-hidden="true">
                <span className={styles.deskArrow}>↗</span>
                <span className={styles.phoneArrow}>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div
        className={styles.pic}
        aria-hidden="true"
        data-placed={top === null ? 'false' : 'true'}
        style={top === null ? undefined : { top }}
      >
        {items.map((item, index) => (
          <Image
            key={item.id}
            src={item.image.src}
            alt=""
            fill
            sizes="240px"
            className={styles.picImage}
            data-active={index === active ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  )
}
