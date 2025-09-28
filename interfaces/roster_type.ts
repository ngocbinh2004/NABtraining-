export interface IRoster {
  id: number,
  squadId: number,
  eventId: number,
  divisionId: number,
  position: string,
  note: string,
  status: string,
  jerseyNumber: string,
  height: number,
  weight: number,
  isCaptain: boolean,
  isSuspended: boolean,
  personalInfo: {
    consentToExpose: boolean,
    name: string,
    altName: string,
    avatarUrl: string,
    gender: string,
    birth: Date
    nationalIdentity: string,
    nationalIdentityExtraDetail: string,
    nationality: string
  }
}

 