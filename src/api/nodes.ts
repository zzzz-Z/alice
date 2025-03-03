/**
   查询所有节点和关系
  GET /neo4j/nodes/selectAllNodesAndShip
  接口ID：244478078
  接口地址：https://app.apifox.com/link/project/5616787/apis/api-244478078
 */
export function getEdges() {
  return request<any[]>({
    method: 'get',
    url: '/api/selectAllNodesAndShip',
  })
}
export function getEdgesById(params: Params) {
  return request<any[]>({
    method: 'get',
    params,
    url: '/api/selectNodeAndShipById',
  })
}

/**  分页查询 */
export function getList(params: Params) {
  return request<any[]>({
    method: 'get',
    params,
    url: '/api/selectDatasPage',
  })
}
export function getNodesById(params: Params) {
  return request<any[]>({
    params,
    method: 'get',
    url: '/api/selectNodeById',
  })
}
export function getNodes() {
  return request<any[]>({
    method: 'get',
    url: '/api/selectAllDatas',
  })
}
export function getTags() {
  return request<any[]>({
    method: 'get',
    url: '/api/selectAllNodes',
  })
}
export function getRelationshipTypes() {
  return request<any[]>({
    method: 'get',
    url: '/api/selectAllRelationshipTypes',
  })
}

export function createdNodes(data: Params) {
  return request({
    url: '/api/common/add/relationshipAndNode',
    method: 'post',
    data,
  })
}

export function updateNodes(data: Params) {
  return request({
    url: '/api/common/edit/ship/nodes',
    method: 'post',
    data,
  })
}

// export function updateNodes(data: Params) {
//   return request({
//     url: '/api/common/edit',
//     method: 'post',
//     data
//   })
// }
/**
   通过nodeId创建两个节点的边关系
  POST /neo4j/nodes/common/add/ship/nodes
  接口ID：244478096
  接口地址：https://app.apifox.com/link/project/5616787/apis/api-244478096
 */
export function connectNode(data: Params) {
  return request({
    url: '/api/common/add/ship/nodes',
    method: 'post',
    data,
  })
}
/**
 *
 * 通过nodeId删除数据(删除全部关系)
 * 接口地址：https://app.apifox.com/link/project/5616787/apis/api-244478095
 */
export function delNode(params: Params) {
  return request({
    url: '/api/common/del/ship',
    method: 'get',
    params,
  })
}
