export { }
declare module 'axios' {
  interface AxiosResponse<T> {
    data: T
    code: number
    message: string
    error: string
  }
}
