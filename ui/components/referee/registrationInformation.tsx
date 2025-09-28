import { useTranslation } from 'next-i18next'
import { ITimeBatch } from 'interfaces/referee_type'
import { beautifyDayMonthForReferee } from 'helpers/beautifyDate'

interface IProps {
  registrationTimeBatch: ITimeBatch[]
  registrationSessions: string[]
  formData: any
}

export default function RegistrationInformation({
  registrationTimeBatch,
  registrationSessions,
  formData,
}: IProps) {
  const { t } = useTranslation()
  if (!formData) return <></>

  return (
    <div className="w-full h-auto lg:max-w-[960px] lg:max-h-[1404px] my-10 mx-auto">
      <p className="w-full lg:w-[780px] h-auto text-white leading-[150%] font-semibold text-xl lg:text-2xl pt-6">
        {t('RefereePage.registration_information')}
      </p>
      <hr className="w-full border-t border-whhite mb-10 mt-2" />
      {registrationSessions.length > 0 && (
        <>
          <p className="block mb-2 font-semibold text-base lg:text-xl text-white">
            {t('RefereePage.registration_session')}
          </p>
          <div className="flex flex-wrap mb-4 gap-4 w-full">
            {registrationSessions.map((item, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={index.toString()}
                  name="session"
                  value={item}
                  defaultChecked={index == 0 ? true : false}
                  className={`hidden peer`}
                  {...formData('registration_session')}
                />
                <label
                  key={index}
                  htmlFor={index.toString()}
                  className={`w-20 h-[48px] lg:h-[51px] flex items-center justify-center text-center font-semibold text-base lg:text-lg cursor-pointer p-2 bg-[#E9E9E9] text-[#6B6B6B] peer-checked:text-white peer-checked:bg-[#009919]`}
                >
                  {beautifyDayMonthForReferee(item)}
                </label>
              </div>
            ))}
          </div>
        </>
      )}

      {registrationTimeBatch.length > 0 && (
        <>
          <p className="block mb-2 font-semibold text-base lg:text-xl text-white pt-6">
            {t('RefereePage.time')}
          </p>
          <div className="flex flex-wrap items-center mb-4 gap-4">
            {registrationTimeBatch.map((item, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={item.id.toString()}
                  name="session"
                  value={item.id}
                  defaultChecked={index == 0 ? true : false}
                  className={`hidden peer`}
                  {...formData('referee_tbatch_id')}
                />
                <label
                  key={item.id}
                  htmlFor={item.id.toString()}
                  className={`w-fit h-[48px] lg:h-[51px] flex items-center justify-center text-center font-semibold text-base lg:text-lg cursor-pointer p-2 bg-[#E9E9E9] text-[#6B6B6B] peer-checked:text-white peer-checked:bg-[#009919]`}
                >
                  {item.start_time}-{item.end_time}
                </label>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
