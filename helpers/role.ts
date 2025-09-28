import { userRole } from './cookie'

import { SITE_ROLE } from 'constants/role'

export const isPlayer = () => userRole() === SITE_ROLE.PLAYER
export const isUser = () => userRole() === SITE_ROLE.USER
export const isAdmin = () =>
  userRole() === SITE_ROLE.ADMIN || userRole() === SITE_ROLE.SUPERADMIN
