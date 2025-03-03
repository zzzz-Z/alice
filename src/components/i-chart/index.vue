<script setup lang="ts">
import type { ChartEvents, Props } from './type';
import * as echarts from 'echarts';
import { isNumber } from 'lodash';
import 'echarts-gl';

const { options, width, height, theme, initOption, ...props } = defineProps<Props>()
const chart = ref<echarts.ECharts>()
const chartDom = ref()
const style = computed(() => ({
  width: isNumber(width) ? `${width}px` : width,
  height: isNumber(height) ? `${height}px` : height,
}))

useResizeObserver(chartDom, () => chart.value?.resize())

watch(
  () => options,
  () => chart.value?.setOption(options),
  { deep: true },
)

const events = Object.keys(props)
  .filter(key => key.startsWith('on'))
  .map(event => event.replace('on', ''))

onMounted(() => {
  const c = chart.value = echarts.init(chartDom.value, theme, initOption)
  c?.setOption(options)

  events.forEach((event) => {
    const eventName = event.toLowerCase()
    const propsEvent = props[`on${event}` as keyof ChartEvents]!
    event.startsWith('Zr:')
      ? c.getZr().on(eventName.replace('Zr:', ''), propsEvent)
      : c?.on(eventName, propsEvent as any)
  })
})

defineExpose(forwardRef(chart))
</script>

<template>
  <div ref="chartDom" class="i-chart" :style="style" />
</template>

<style>
.i-chart {
  width: 100%;
  height: 100%;
}
</style>
