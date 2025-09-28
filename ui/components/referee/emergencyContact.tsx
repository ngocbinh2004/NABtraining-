import { useTranslation } from 'next-i18next'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

type Props = {
  formData: any
  errors: any
}

const EmergencyContact: NextPage<Props> = ({ formData, errors }) => {
  const { t } = useTranslation()
  const relationList = [
    t('RefereePage.spouse'),
    t('RefereePage.parents'),
    t('RefereePage.siblings'),
    t('RefereePage.relatives'),
    t('RefereePage.friends'),
    t('RefereePage.others'),
  ]

  if (!formData) return <></>

  return (
    <div className="w-full h-auto lg:max-w-[960px] lg:max-h-[1404px] my-10 mx-auto">
      <p className="w-full lg:max-w-[780px] h-auto text-white leading-[150%] font-semibold text-xl lg:text-2xl pt-6">
        {t('RefereePage.emergency_contact')}
      </p>
      <hr className="w-full border-t border-gray-300 mb-6 mt-4" />
      {/* Emergency Contact Name */}
      <p className="text-base font-semibold text-white mb-2">
        {t('RefereePage.emer_contact_label_name')}
      </p>
      <div className="flex flex-col lg:flex-row w-full gap-2">
        {/*Input last name*/}
        <div className="w-full lg:w-1/2">
          <input
            type="text"
            id="emer_lastname"
            name="emer_lastname"
            placeholder={t('RefereePage.last_name')}
            className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
            {...formData('emer_cont_lastname', {
              required: t('RefereePage.last_name_required'),
            })}
          />
          {errors.emer_cont_lastname ? (
            <p className="text-[#FF2222] text-base">
              {errors.emer_cont_lastname.message}
            </p>
          ) : null}
        </div>

        {/*Input first name*/}
        <div className="w-full lg:w-1/2">
          <input
            type="text"
            id="emer_firstname"
            name="emer_firstname"
            placeholder={t('RefereePage.first_name')}
            className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
            {...formData('emer_cont_firstname', {
              required: t('RefereePage.first_name_required'),
            })}
          />
          {errors.emer_cont_firstname ? (
            <p className="text-[#FF2222] text-base">
              {errors.emer_cont_firstname.message}
            </p>
          ) : null}
        </div>
      </div>
      {/* Emergency Relation Contact */}
      {relationList.length > 0 && (
        <>
          <p className="block lg:mt-6 mb-2 font-semibold text-base lg:text-xl text-white">
            {t('RefereePage.relation')}
          </p>
          <div className="flex flex-wrap items-center mb-2 gap-4">
            {relationList.map((item, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={item}
                  name="session"
                  value={item}
                  defaultChecked={
                    item == t('RefereePage.spouse') ? true : false
                  }
                  className={`hidden peer`}
                  {...formData('emer_cont_relation')}
                />
                <label
                  key={index}
                  htmlFor={item}
                  className={`w-fit h-[48px] flex items-center justify-center text-center font-medium text-base cursor-pointer p-2 bg-[#E9E9E9] text-[#6B6B6B] peer-checked:text-white peer-checked:bg-[#009919] `}
                >
                  {item}
                </label>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Emergency Relation Contact Phone Number */}
      <div className="flex flex-col lg:flex-row w-full gap-2 mt-6">
        <div className="w-full lg:w-1/2">
          <p className="text-base font-semibold text-white mb-2">
            {t('RefereePage.contact_phone_numbers')}
          </p>
          <input
            type="text"
            id="emer_cont_mobile"
            name="emer_cont_mobile"
            placeholder={`${t('RefereePage.place_holder')} ${t(
              'RefereePage.contact_phone_numbers'
            )}`}
            className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
            {...formData('emer_cont_mobile', {
              required: t('RefereePage.Emergency.phone_number_required'),
              pattern: {
                value: /^[0-9]{10}$/,
                message: t('RefereePage.phone_number_invalid'),
              },
            })}
          />
          {errors?.emer_cont_mobile ? (
            <p className="text-[#FF2222] text-base">
              {errors?.emer_cont_mobile?.message}
            </p>
          ) : null}
        </div>

        <div className="w-full lg:w-1/2">
          <p className="text-base font-semibold text-white mb-2">
            {t('RefereePage.email_address')}
          </p>
          <input
            type="email"
            id="emergencyemail"
            name="emergencyemail"
            placeholder={`${t('RefereePage.placeholder_emergencty_contact')}`}
            className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
            {...formData('emer_cont_email', {
              required: t('RefereePage.Emergency.email_required'),
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: t('RefereePage.email_invalid'),
              },
            })}
          />
          {errors?.emer_cont_email ? (
            <p className="text-[#FF2222] text-base">
              {errors?.emer_cont_email.message}
            </p>
          ) : null}
        </div>
      </div>
      <hr className="w-full border-t border-gray-300 mt-10" />
    </div>
  )
}

export default EmergencyContact
