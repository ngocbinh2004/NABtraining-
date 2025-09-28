import { IPersonalInformationType } from './personal_information_type'

export interface IindividualType {
  id: number
  isCaptain?: boolean
  isSuspended?: boolean
  jerseyNumber?: string
  position: string
  height?: number
  weight?: number
  squadId: number
  status: string
  personalInfo: IPersonalInformationType
}
