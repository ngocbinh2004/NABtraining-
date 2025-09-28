import { z } from 'zod'

import {
  RESET_PASSWORD,
  REGISTER_STEP_ONE,
  REGISTER_STEP_TWO,
  REGISTER_STEP_TWO_CHECK_VERIFY_CODE,
  REGISTER_STEP_ONE_COMPETITION,
  TEAM_PROFILE,
  EVENT_RANK_TABLE,
  EVENT_MATCH_SET_PROFILE,
  EVENT_MATCH_PROFILE,
  EVENT_PROFILE,
  EVENT_MATCH_SET_RECORD_PROFILE,
} from 'constants/validation'

export const validateResetPasswordForm = (inputs: unknown) =>
  parse(RESET_PASSWORD.safeParse(inputs))

export const validateFirstStepRegisterForm = (inputs: unknown) => {
  return REGISTER_STEP_ONE.safeParse(inputs)
}

export const validateFirstStepCompetitionForm = (inputs: unknown) => {
  return REGISTER_STEP_ONE_COMPETITION.safeParse(inputs)
}

export const validateSecondStepRegisterForm = (inputs: unknown) => {
  return parse(REGISTER_STEP_TWO.safeParse(inputs))
}

export const validateSecondStepCheckVerifyCodeRegisterForm = (
  inputs: unknown
) => {
  return parse(REGISTER_STEP_TWO_CHECK_VERIFY_CODE.safeParse(inputs))
}

export const validateTeamProfileForm = (inputs: unknown) => {
  return parse(TEAM_PROFILE.safeParse(inputs))
}
export const validateEventMatchSetRecordForm = (inputs: unknown) => {
  return parse(EVENT_MATCH_SET_RECORD_PROFILE.safeParse(inputs))
}

export const validateEventMatchSetForm = (inputs: unknown) => {
  return parse(EVENT_MATCH_SET_PROFILE.safeParse(inputs))
}

export const validateEventMatchProfileForm = (inputs: unknown) => {
  return parse(EVENT_MATCH_PROFILE.safeParse(inputs))
}

export const validateEventRankTable = (inputs: unknown) => {
  return parse(EVENT_RANK_TABLE.safeParse(inputs))
}

export const validateEventProfileForm = (inputs: unknown) => {
  return parse(EVENT_PROFILE.safeParse(inputs))
}

function parse(
  res: z.SafeParseReturnType<
    {
      [key: string]: any
    },
    {
      [key: string]: any
    }
  >
): { success: boolean; error: { [key: string]: any } } {
  if (res.success) {
    return {
      success: true,
      error: {},
    }
  }

  return {
    success: false,
    error: Object.entries(res.error?.format()).reduce(
      (errors = {}, [name, value]: [name: string, value: any]) => {
        const noError = !value?._errors || !Array.isArray(value?._errors)
        if (noError) return errors

        return {
          ...errors,
          [name]: value?._errors?.[0],
        }
      },
      {}
    ),
  }
}
