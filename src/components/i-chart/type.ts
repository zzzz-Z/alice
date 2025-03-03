import type { ECElementEvent, ElementEvent } from 'echarts'

type MouseEventName =
  | 'click'
  | 'dblclick'
  | 'mouseout'
  | 'mouseover'
  | 'mouseup'
  | 'mousedown'
  | 'mousemove'
  | 'contextmenu'
  | 'globalout'

type ElementEventName =
  | MouseEventName
  | 'mousewheel'
  | 'drag'
  | 'dragstart'
  | 'dragend'
  | 'dragenter'
  | 'dragleave'
  | 'dragover'
  | 'drop'

type ZRenderEventName = `zr:${ElementEventName}`

type OtherEventName =
  | 'highlight'
  | 'downplay'
  | 'selectchanged'
  | 'legendselectchanged'
  | 'legendselected'
  | 'legendunselected'
  | 'legendselectall'
  | 'legendinverseselect'
  | 'legendscroll'
  | 'datazoom'
  | 'datarangeselected'
  | 'graphroam'
  | 'georoam'
  | 'treeroam'
  | 'timelinechanged'
  | 'timelineplaychanged'
  | 'restore'
  | 'dataviewchanged'
  | 'magictypechanged'
  | 'geoselectchanged'
  | 'geoselected'
  | 'geounselected'
  | 'axisareaselected'
  | 'brush'
  | 'brushEnd'
  | 'brushselected'
  | 'globalcursortaken'

type MouseEmits = {
  [key in `on${Capitalize<MouseEventName>}`]: (params: ECElementEvent) => void;
}

type ZRenderEmits = {
  [key in `on${Capitalize<ZRenderEventName>}`]: (params: ElementEvent) => void;
}

type OtherEmits = {
  [key in `on${Capitalize<OtherEventName>}`]: (params: any) => void;
}

export type ChartEvents = MouseEmits
  & OtherEmits
  & ZRenderEmits
  & {
    onRendered: (params: { elapsedTime: number }) => void
    onFinished: () => void
  }

export interface ChartProps {
  width?: number | string
  height?: number | string
  loading?: boolean
  options: echarts.EChartsOption
  theme?: any
  initOption?: any
}

export type Props = ChartProps & Partial<ChartEvents>
