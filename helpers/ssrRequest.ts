import axios from 'axios'

import { api } from '../constants/api'

axios.defaults.baseURL = api

export const GET = async (path: string, query: string = '') => {
  const response = await fetch(`/api/${path}?${query}`, {
    method: 'GET',
  })

  return response.json()
}

export const POST = async (path: string, body: any) => {
  const response = await fetch(`/api/${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return response.json()
}

export const POST_NEW = async (
  path: string,
  body: any,
  p: Partial<RequestInit> = {}
) => {
  const response = await fetch(`/api/${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      referer: process.env.NEXT_PUBLIC_APP_URL || '',
    },
    ...p,
  })

  const text = await response.text()
  let data: any = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = text || {}
  }

  if (!response.ok) {
    const errorMessage = data.error
    throw new Error(errorMessage)
  }

  return data
}

export const PUT = async (path: string, body: any) => {
  const response = await fetch(`/api/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      referer: process.env.NEXT_PUBLIC_APP_URL || '',
    },
  })
  const res = await response.json()
  if (response?.status >= 400) {
    throw new Error(`${res}`)
  } else {
    return res
  }
}

export const DELETE = async (path: string) => {
  const response = await fetch(`/api/${path}`, {
    method: 'DELETE',
    headers: {
      referer: process.env.NEXT_PUBLIC_APP_URL || '',
    },
  })
  const res = await response.json()
  if (response?.status >= 400) {
    throw new Error(`${res}`)
  } else {
    return res
  }
}
