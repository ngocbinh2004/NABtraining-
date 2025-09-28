import { IPersonalInformationType } from './personal_information_type'

export interface IcrewType {
  id: number
  positions: string[]
  squadId: number
  status: string
  personalInfo: IPersonalInformationType
}
