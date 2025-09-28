import { z } from 'zod'

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\-\(\)\@\#\$\%\!\^\&\*\/\\\+\=])[A-Za-z\d\-\(\)\@\#\$\%\!\^\&\*\/\\\+\=]{8,}$/

export const RESET_PASSWORD = z
  .object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, { message: 'Password must be 8 or more characters long' })
      .regex(PASSWORD_REGEX, {
        message:
          'Password must contains number, uppercase, and lowercase letters and symbols',
      }),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
        invalid_type_error: 'Confirm Password is required',
      })
      .min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Confirm Password did not match',
        path: ['confirmPassword'],
      })
    }
  })

export const REGISTER_STEP_ONE_COMPETITION = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name is required',
      })
      .min(1, 'Name is required'),
    first_name: z.string({
      required_error: 'First Name is required',
      invalid_type_error: 'First Name is required',
    }),
    last_name: z.string({
      required_error: 'Last Name is required',
      invalid_type_error: 'Last Name is required',
    }),
    birthdate: z.string({
      required_error: 'Birth is required',
      invalid_type_error: 'Birth is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be string',
      })
      .email({
        message: 'Invalid email address',
      }),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password is required',
      })
      .min(8, { message: 'Password must be 8 or more characters long' })
      .regex(PASSWORD_REGEX, {
        message:
          'Password must contains number, uppercase, and lowercase letters and symbols',
      }),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
        invalid_type_error: 'Confirm Password is required',
      })
      .min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Confirm Password did not match',
        path: ['confirmPassword'],
      })
    }
  })

export const REGISTER_STEP_ONE = z
  .object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name is required',
    }),
    first_name: z.string({
      required_error: 'First Name is required',
      invalid_type_error: 'First Name is required',
    }),
    last_name: z.string({
      required_error: 'Last Name is required',
      invalid_type_error: 'Last Name is required',
    }),
    // birthdate: z.string({
    //   required_error: 'Birth is required',
    //   invalid_type_error: 'Birth is required',
    // }),
    birthdate: z.date({
      required_error: 'Birth is required',
    }),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password is required',
      })
      .min(8, { message: 'Password must be 8 or more characters long' })
      .regex(PASSWORD_REGEX, {
        message:
          'Password must contains number, uppercase, and lowercase letters and symbols',
      }),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
        invalid_type_error: 'Confirm Password is required',
      })
      .min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Confirm Password did not match',
        path: ['confirmPassword'],
      })
    }
  })

export const REGISTER_STEP_TWO = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be string',
    })
    .email({
      message: 'Invalid email address',
    }),
  weight_kg: z.preprocess(
    (weight) => (!weight ? 0 : parseInt(weight as string, 10)),
    z.number().min(0, 'Weight must be a positive number').optional()
  ),
  height_cm: z.preprocess(
    (height) => (!height ? 0 : parseInt(height as string, 10)),
    z.number().min(0, 'Height must be a positive number').optional()
  ),
})

export const REGISTER_STEP_TWO_CHECK_VERIFY_CODE = z.object({
  verify_code: z
    .string({
      required_error: 'Verify Code is required',
      invalid_type_error: 'Verify Code is required',
    })
    .min(6, { message: 'Verify Code must be 6 characters long' })
    .length(6, { message: 'Verify Code only 6 characters long' }),
})

export const TEAM_PROFILE = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1, 'Name is required')
    .max(20, 'Max Name is 20 char length'),
  abbreviation: z
    .string({
      required_error: 'Abbreviation is required',
    })
    .min(1, 'Abbreviation is required')
    .max(10, 'Max Abbreviation is 10 char length'),
  categoryId: z
    .number({ required_error: 'Category is required' })
    .min(0, 'Category is required'),
})

export const EVENT_RANK_TABLE = z.object({
  name: z.string({
    required_error: 'Rank Table name is required',
  }),
})

export const EVENT_MATCH_PROFILE = z.object({
  team1: z.preprocess(
    (team) => (team ? parseInt(team as string, 10) : 0),
    z
      .number({ required_error: 'Team 1 is required' })
      .min(1, 'Team 1 is required')
  ),
  team2: z.preprocess(
    (team) => (team ? parseInt(team as string, 10) : 0),
    z
      .number({ required_error: 'Team 2 is required' })
      .min(1, 'Team 2 is required')
  ),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  name: z.string({ required_error: 'Name is required' }),
  location: z.string({
    required_error: 'Location is required',
  }),
})

export const EVENT_MATCH_SET_RECORD_PROFILE = z.object({
  userTeamId: z.preprocess(
    (userTeamId) => (userTeamId ? parseInt(userTeamId as string, 10) : 0),
    z
      .number({
        required_error: 'Player is required',
      })
      .positive('Player is required')
      .min(1, 'Player is required')
  ),
})

export const EVENT_MATCH_SET_PROFILE = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
  no: z.preprocess(
    (no) => (no ? parseInt(no as string, 10) : 0),
    z
      .number({ required_error: 'No is required' })
      .min(1, 'No should be greater than 0')
  ),
})

export const EVENT_PROFILE = z.object({
  registerStartDate: z.date({
    required_error: 'Register start date is required',
  }),
  registerEndDate: z.date({
    required_error: 'Register end date is required',
  }),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  capacity: z.preprocess(
    (capacity) => (capacity ? parseInt(capacity as string, 10) : 0),
    z
      .number({ required_error: 'Capacity is required' })
      .positive('Capacity is required')
      .min(1, 'Capacity must be positive number')
  ),
  name: z.string({ required_error: 'Name is required' }),
  category: z.number({ required_error: 'Category is required' }),
  location: z.string({
    required_error: 'Location is required',
  }),
})
