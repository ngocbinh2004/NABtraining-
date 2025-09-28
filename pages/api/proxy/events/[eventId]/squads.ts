import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_CUSTOMER_API,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.NEXT_CUSTOMER_API_KEY,
    withCredentials: true,
  },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventId } = req.query

  if (!eventId) {
    return res.status(400).json({ error: "Missing id" })
  }

  try {
    const response = await api.get(`/events/${eventId}/squads`)
    res.status(200).json(response.data)
  } catch (error: any) {
    console.error("Proxy error:", error.message)
    res.status(500).json({ error: "Proxy failed", details: error.message })
  }
}