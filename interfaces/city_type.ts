export interface ICityType {
  id: number
  name: string
  en_name: string
  districts: {
    id: number
    name: string
    en_name: string
  }[]
}
