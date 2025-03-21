export function getNodes() {
  return request('/api/examples/data-gl/asset/data/internet.graph.json')
  // return request('/api/examples/data-gl/asset/data/npmdep.json')
  // return request('/api/examples/data/asset/data/webkit-dep.json')
}

export function getNodesAndEdges(params?: Params) {
  return request({
    method: 'get',
    params,
    url: '/neo4j/nodes/selectAllNodesAndShipArr'
  })
}
