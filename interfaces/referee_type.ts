export interface ITimeBatch {
  id: number
  create_dt: string
  updated_dt: string
  created_by: number
  updated_by: number
  start_time: string
  end_time: string
}

export interface ICourseRule {
  id: number
  create_dt: string
  updated_dt: string
  created_by: number
  updated_by: number
  title: string
  contents: string
  language: string
}

export interface IRefereeCourse {
  id: number
  create_dt: string
  updated_dt: string
  created_by: number
  updated_by: number
  name: string
  location: string
  grade: string
  start_date: number
  end_date: number
  time_batches: ITimeBatch[]
  rules: ICourseRule[]
  registration_session: string[]
}

export interface IRefereeUserExperience {
  cup_competition_name: string
  grade: string
}

export interface IRefereeUserRegistration {
  referee_tbatch_id: number
  registration_session: string
  status: string
  confirm_paid: number
  payment_date: number
  english_name: string
  chinese_name: string
  gender: string
  birthdate: Date
  portrait_photo: string
  referee_certificate: string
  id_documents: string
  id_issue_date: number
  id_exp_date: number
  residential_add: string
  mailing_add: string
  mobile: string
  landline: string
  email: string
  last_payment_account: string
  cur_job_dept: string
  cur_job_work_add: string
  cur_job_position: string
  cur_job_institution: string
  emer_cont_relation: string
  emer_cont_mobile: string
  emer_cont_landline: string
  emer_cont_email: string
  volleyball_exp: string
}
