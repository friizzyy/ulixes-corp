import {
  lifecycleStages,
  type LifecycleStageId,
} from '@/lib/homepage-content'
import styles from './homepage.module.css'

export type SignalNetworkProps = {
  activeStageId?: LifecycleStageId
  highlightedStageIds?: readonly LifecycleStageId[]
  renderMode?: 'path' | 'checkpoints' | 'closing'
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

type RouteDefinition = {
  id: LifecycleStageId
  path: string
  node: readonly [number, number]
  verticalPath: string
  verticalNode: readonly [number, number]
  closingPath: string
}

const routes: readonly RouteDefinition[] = [
  {
    id: 'capture',
    path: 'M 0 116 C 58 116, 92 116, 152 116',
    node: [152, 116],
    verticalPath: 'M 72 0 L 72 74',
    verticalNode: [72, 74],
    closingPath: 'M 68 92 C 390 92, 760 272, 1134 320',
  },
  {
    id: 'lifecycle',
    path: 'M 152 116 C 226 116, 238 262, 336 262',
    node: [336, 262],
    verticalPath: 'M 72 74 L 72 178',
    verticalNode: [72, 178],
    closingPath: 'M 68 174 C 398 174, 768 284, 1134 320',
  },
  {
    id: 'risk',
    path: 'M 336 262 C 418 262, 454 150, 544 150',
    node: [544, 150],
    verticalPath: 'M 72 178 L 72 282',
    verticalNode: [72, 282],
    closingPath: 'M 68 256 C 408 256, 778 300, 1134 320',
  },
  {
    id: 'controls',
    path: 'M 544 150 C 632 150, 642 338, 742 338',
    node: [742, 338],
    verticalPath: 'M 72 282 L 72 386',
    verticalNode: [72, 386],
    closingPath: 'M 68 338 C 408 338, 778 332, 1134 320',
  },
  {
    id: 'settlement',
    path: 'M 742 338 C 836 338, 846 218, 942 218',
    node: [942, 218],
    verticalPath: 'M 72 386 L 72 490',
    verticalNode: [72, 490],
    closingPath: 'M 68 420 C 398 420, 768 348, 1134 320',
  },
  {
    id: 'reporting',
    path: 'M 942 218 C 1016 218, 1060 116, 1200 116',
    node: [1138, 140],
    verticalPath: 'M 72 490 L 72 640',
    verticalNode: [72, 612],
    closingPath: 'M 68 502 C 390 502, 760 360, 1134 320',
  },
] as const

const stageNames = new Map(
  lifecycleStages.map((stage) => [stage.id, stage.label]),
)

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ')
}

export function SignalNetwork({
  activeStageId,
  highlightedStageIds,
  renderMode = 'path',
  orientation = 'horizontal',
  className,
}: SignalNetworkProps) {
  const activeIndex = activeStageId
    ? routes.findIndex((route) => route.id === activeStageId)
    : -1
  const highlighted = new Set(highlightedStageIds)
  const useVerticalGeometry =
    orientation === 'vertical' && renderMode !== 'closing'

  return (
    <svg
      className={classNames(styles.signalNetwork, className)}
      viewBox={useVerticalGeometry ? '0 0 144 640' : '0 0 1200 640'}
      preserveAspectRatio={useVerticalGeometry ? 'xMidYMid meet' : 'none'}
      aria-hidden="true"
      focusable="false"
      data-render-mode={renderMode}
      data-orientation={useVerticalGeometry ? 'vertical' : 'horizontal'}
    >
      {routes.map((route, index) => {
        const explicitlyHighlighted = highlighted.has(route.id)
        const pathHighlighted =
          renderMode === 'path' &&
          (activeIndex >= 0
            ? index <= activeIndex
            : highlightedStageIds
              ? explicitlyHighlighted
              : false)
        const nodeHighlighted =
          renderMode === 'checkpoints'
            ? explicitlyHighlighted
            : pathHighlighted ||
              explicitlyHighlighted ||
              route.id === activeStageId
        const isClosing = renderMode === 'closing'

        return (
          <g
            key={route.id}
            className={styles.signalStage}
            data-stage-id={route.id}
            data-stage-name={stageNames.get(route.id)}
            data-active={route.id === activeStageId ? 'true' : undefined}
            data-highlighted={
              explicitlyHighlighted || pathHighlighted ? 'true' : undefined
            }
          >
            <path
              className={classNames(
                styles.signalRoute,
                styles[`signalRoute_${route.id}`],
              )}
              d={
                isClosing
                  ? route.closingPath
                  : useVerticalGeometry
                    ? route.verticalPath
                    : route.path
              }
              data-stage-id={route.id}
              data-highlighted={pathHighlighted ? 'true' : undefined}
              data-converges={isClosing ? 'true' : undefined}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              className={classNames(
                styles.signalNode,
                styles[`signalNode_${route.id}`],
              )}
              cx={
                isClosing
                  ? 1134
                  : useVerticalGeometry
                    ? route.verticalNode[0]
                    : route.node[0]
              }
              cy={
                isClosing
                  ? 320
                  : useVerticalGeometry
                    ? route.verticalNode[1]
                    : route.node[1]
              }
              r={isClosing ? 5 : useVerticalGeometry ? 8 : 6}
              data-stage-id={route.id}
              data-highlighted={nodeHighlighted ? 'true' : undefined}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )
      })}
    </svg>
  )
}
