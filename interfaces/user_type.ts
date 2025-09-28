export interface Users {
  id: number
  create_dt: Date
  updated_dt: Date
  email: string
  name: string
  role: string
  phone?: string
  gender?: string
  birthdate?: string
  profile_picture?: string
  weight_kg?: number
  height_cm?: number
}
