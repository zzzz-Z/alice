export function getNodes() {
  return request('/api/examples/data-gl/asset/data/internet.graph.json')
  // return request('/api/examples/data-gl/asset/data/npmdep.json')
  // return request('/api/examples/data/asset/data/webkit-dep.json')
}
