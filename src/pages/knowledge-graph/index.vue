<script setup lang="tsx">
import type { EChartsOption } from 'echarts'
import { getNodes } from './api'

const dataSource = reactive<Params>({})
const options = computed<EChartsOption>(() => ({
  // legend: {
  //   data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other'],
  // },
  series: [
    {
      type: 'graphGL',
      ...dataSource,
      // categories: dataSource.categories.sort((a, b) => {
      //   return a.name - b.name
      // }),
      lineStyle: {
        color: 'rgba(255,255,255,0.2)',
      },
      itemStyle: {
        opacity: 1,
      },
      forceAtlas2: {
        steps: 1,
        stopThreshold: 1,
        jitterTolerence: 10,
        edgeWeight: [0.2, 1],
        gravity: 0,
        edgeWeightInfluence: 1,
        scaling: 0.2,
      },
    },
  ],
}))

onMounted(async () => {
  const data: Params = await getNodes()
  const edges = data.edges.map((edge) => {
    return {
      source: edge[0],
      target: edge[1],
      value: 2,
    }
  })
  const categories = []
  const categoriesMap: Params = {}
  const nodes = data.nodes.map((node) => {
    if (!categoriesMap[node[3]]) {
      categories.push({
        name: node[3],
      })
      categoriesMap[node[3]] = true
    }
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      // x: node[0],
      // y: node[1],
      symbolSize: node[2],
      category: node[3],
      value: 1,
    }
  })
  dataSource.nodes = nodes
  dataSource.edges = edges
  dataSource.dataSource = dataSource
})
</script>

<template>
  <IChart :options="options" theme="dark" />
</template>

<style lang="scss" scoped>

</style>
