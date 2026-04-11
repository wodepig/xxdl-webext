export interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
}

export interface HttpResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Headers
}

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

async function request<T>(url: string, options: HttpOptions = {}): Promise<HttpResponse<T>> {
  const { method = 'GET', headers = {}, body, timeout = 30000 } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new HttpError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      )
    }

    const data = await response.json() as T

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    }
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof HttpError) throw error
    throw new HttpError(error instanceof Error ? error.message : 'Unknown error', 0)
  }
}

export const http = {
  get<T>(url: string, headers?: Record<string, string>) {
    return request<T>(url, { method: 'GET', headers })
  },

  post<T>(url: string, body?: unknown, headers?: Record<string, string>) {
    return request<T>(url, { method: 'POST', body, headers })
  },

  put<T>(url: string, body?: unknown, headers?: Record<string, string>) {
    return request<T>(url, { method: 'PUT', body, headers })
  },

  patch<T>(url: string, body?: unknown, headers?: Record<string, string>) {
    return request<T>(url, { method: 'PATCH', body, headers })
  },

  delete<T>(url: string, headers?: Record<string, string>) {
    return request<T>(url, { method: 'DELETE', headers })
  }
}
