export function getList() {
  return request({
    method: 'get',
    url: '/api/user'
  })
}
export function del(params: any) {
  return request({
    method: 'get',
    url: '/api/user',
    params
  })
}

export function getUser() {
  return request<any[]>({
    method: 'get',
    url: '/api/user'
  })
}

export function getAuth() {
  return request<any[]>({
    method: 'get',
    url: '/api/auth'
  })
}

export function create(params: any) {
  return request({
    method: 'get',
    url: '/api/user',
    params
  })
}

export function edit(params: any) {
  return request({
    method: 'get',
    url: '/api/auth',
    params
  })
}
