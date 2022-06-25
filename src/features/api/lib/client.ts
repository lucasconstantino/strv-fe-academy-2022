import { setAccessToken, setRefreshToken } from '~/features/auth/storage'

import type {
  AfterRequestInterceptor,
  BeforeRequestInterceptor,
} from './network-provider'
import { NetworkProvider } from './network-provider'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const apiKey = process.env.NEXT_PUBLIC_API_KEY

// Safeguard the application isn't initiated without NEXT_PUBLIC_API_URL
if (!apiUrl) {
  throw new Error('Missing NEXT_PUBLIC_API_URL environment variable')
}

// Safeguard the application isn't initiated without NEXT_PUBLIC_API_KEY
if (!apiKey) {
  throw new Error('Missing NEXT_PUBLIC_API_KEY environment variable')
}

/**
 * Before request hook to append API Key header on all requests.
 */

const appendAPIKey: BeforeRequestInterceptor = (request) => {
  request.headers.append('APIKey', apiKey)
  return request
}

const persistToken: AfterRequestInterceptor = (
  _request,
  _options,
  response
) => {
  const accessToken = response.headers.get('Authorization')
  const refreshToken = response.headers.get('Refresh-Token')
  if (accessToken) setAccessToken(accessToken)
  if (refreshToken) setRefreshToken(refreshToken)
  return response
}

/**
 * Before request hook to retrieve auth token from local storage and append it to the request.
 */
const authenticateRequest: BeforeRequestInterceptor = (request) => {
  const token = localStorage.getItem('token')
  request.headers.append('Authorization', `Bearer ${token}`)
  return request
}

const api = new NetworkProvider({
  baseUrl: apiUrl,
  interceptors: {
    beforeRequest: [appendAPIKey],
    afterRequest: [persistToken],
  },
})

const privateApi = api.extend({
  interceptors: { beforeRequest: [authenticateRequest] },
})

export { api, privateApi }
