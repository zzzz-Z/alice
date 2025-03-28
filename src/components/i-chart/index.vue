<script setup lang="ts">
import type { ChartEvents, Props } from './type';
import * as echarts from 'echarts';
import { isNumber } from 'lodash';

const { options, width, height, theme, initOption, ...props } = defineProps<Props>()
const chartRef = ref<echarts.ECharts>()
const chartDom = ref()
const style = computed(() => ({
  width: isNumber(width) ? `${width}px` : width,
  height: isNumber(height) ? `${height}px` : height,
}))

useResizeObserver(chartDom, () => chartRef.value?.resize())

watch(
  () => options,
  () => chartRef.value?.setOption(options),
  { deep: true },
)

onMounted(() => {
  const chart = chartRef.value = echarts.init(chartDom.value, theme, initOption)
  chart?.setOption(options)
  initEvents(chart)
})

function initEvents(chart: echarts.ECharts) {
  Object.keys(props)
    .filter(key => key.startsWith('on'))
    .map(event => event.replace('on', ''))
    .forEach((event) => {
      const eventName = event.toLowerCase()
      const propsEvent = props[`on${event}` as keyof ChartEvents]!
      event.startsWith('Zr:')
        ? chart.getZr().on(eventName.replace('Zr:', ''), propsEvent)
        : chart?.on(eventName, propsEvent as any)
    })
}

defineExpose(forwardRef(chartRef))
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
