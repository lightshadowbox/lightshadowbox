import axios from 'axios'
import { Config } from 'configs'

const REQUEST_TIMEOUT = 7000

/**
 * Create a new Axios client instance
 */

const requestHeaders = () => ({
  'content-type': 'application/json',
})

const getClient = (baseURLDomain, headers) => {
  const baseUrl = baseURLDomain || Config.API_SERVER
  const customHeaders = headers || {}

  const options = {
    baseURL: baseUrl,
    timeout: REQUEST_TIMEOUT,
    headers: {
      ...requestHeaders(),
      ...customHeaders,
    },
  }
  const client = axios.create(options)

  // Add a request interceptor
  client.interceptors.request.use(
    (requestConfig) => requestConfig,
    (requestError) => {
      console.log(requestError)

      return Promise.reject(requestError)
    },
  )

  // Add a response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status >= 500) {
        console.log(error)
      }

      return Promise.reject(error)
    },
  )

  return client
}

class HttpClient {
  constructor(baseURLDomain = null, headers = null) {
    this.client = getClient(baseURLDomain, headers)
  }

  get(url, conf = {}) {
    return this.client
      .get(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

  delete(url, conf = {}) {
    return this.client
      .delete(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

  head(url, conf = {}) {
    return this.client
      .head(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

  options(url, conf = {}) {
    return this.client
      .options(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

  post(url, data = {}, conf = {}) {
    return this.client
      .post(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

  put(url, data = {}, conf = {}) {
    return this.client
      .put(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

  patch(url, data = {}, conf = {}) {
    return this.client
      .patch(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }
}

export default HttpClient
