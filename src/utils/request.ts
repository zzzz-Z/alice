import axios from 'axios'
import { saveAs } from 'file-saver'

const request = axios.create({
  baseURL: '/dev-api',
  timeout: 10000,
})

request.interceptors.request.use((config) => {
  return config
})

request.interceptors.response.use((res) => {
  if (['blob', 'arraybuffer'].includes(res.config.responseType!)) {
    if (res.code === 200) {
      const filename = res?.headers?.['content-disposition']
        ?.split(';')?.[1]
        ?.split('filename=')?.[1]
      saveAs(res.data, filename)
    }
    return res
  }
  return res.data
})

export { request }
