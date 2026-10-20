'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { SlabButton } from '@/components/site'

/** The URL form of a stage name, shared with the Calypso page's ?stage= reader. */
export const stageSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-')

interface LiveStage {
  index: number
  setIndex: (index: number) => void
}

const LiveStageContext = createContext<LiveStage | null>(null)

/*
 * The Calypso band's shared stage: the live lifecycle reports the stage it is
 * showing, and the band's buttons carry it, so "Explore Calypso expertise"
 * opens the Calypso page's lifecycle on that same stage.
 */
export function LiveStageProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0)
  return <LiveStageContext.Provider value={{ index, setIndex }}>{children}</LiveStageContext.Provider>
}

export const useLiveStage = () => useContext(LiveStageContext)

interface StageLinkProps {
  href: string
  stages: readonly { name: string }[]
  block?: boolean
  children: ReactNode
}

export function CalypsoStageLink({ href, stages, block, children }: StageLinkProps) {
  const live = useLiveStage()
  const stage = stages[live?.index ?? 0] ?? stages[0]
  return (
    <SlabButton href={`${href}?stage=${stageSlug(stage.name)}`} variant="light" arrow="→" block={block}>
      {children}
    </SlabButton>
  )
}
