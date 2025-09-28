import { useTranslation } from 'next-i18next'
import { NextPage } from 'next'
import Icon from '@/atoms/Icon'
import { ICityType } from 'interfaces/city_type'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { IDistrictType } from 'interfaces/district_type'

type Props = {
  formData: any
  errors: any
  watch: any
  cityList: ICityType[]
}

const CurrentOccupation: NextPage<Props> = ({
  formData,
  errors,
  watch,
  cityList,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const locale = router.locale

  const selectedCompanyCity =
    Number(watch('cur_job_work_city')) || cityList[0] ? cityList[0].id : 0
  const [companyDistrictList, setCompanyDistricList] = useState<
    IDistrictType[]
  >(
    selectedCompanyCity
      ? cityList.filter((item) => item.id == selectedCompanyCity)[0].districts
      : []
  )

  useEffect(() => {
    if (selectedCompanyCity) {
      const districts = cityList.filter(
        (item) => item.id == selectedCompanyCity
      )[0].districts
      setCompanyDistricList(districts)
    } else {
      setCompanyDistricList([])
    }
  }, [selectedCompanyCity, cityList])

  if (!formData) return <></>

  return (
    <div className="w-full h-auto lg:max-w-[960px] lg:max-h-[1404px] my-10 mx-auto">
      <p className="w-full lg:w-[720px] h-auto text-white leading-[150%] font-semibold text-xl lg:text-2xl pt-7">
        {t('RefereePage.current_occupation')}
      </p>
      <hr className="w-full border-t border-white my-4" />
      <div className="flex flex-col lg:flex-row w-full gap-2">
        {/*Input department/Company Name*/}
        <div className="w-full lg:w-1/2">
          <p className="block mb-2 text-base font-semibold text-white mt-4">
            {t('RefereePage.department')}
          </p>

          <input
            type="text"
            id="department"
            name="department"
            placeholder={`${t('RefereePage.place_holder')} ${t(
              'RefereePage.department'
            )}`}
            className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
            {...formData('cur_job_institution', {
              required: t('RefereePage.department_required'),
            })}
          />
          {errors.cur_job_institution && (
            <p className="text-[#FF2222] text-base">
              {errors.cur_job_institution.message}
            </p>
          )}
        </div>

        {/*Input job title*/}
        <div className="w-full lg:w-1/2">
          <p className="text-base font-semibold text-white mt-4 mb-2">
            {t('RefereePage.job_title')}
          </p>
          <input
            type="text"
            id="position"
            name="position"
            placeholder={`${t('RefereePage.place_holder')} ${t(
              'RefereePage.job_title'
            )}`}
            className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
            {...formData('cur_job_position', {
              required: t('RefereePage.job_title_required'),
            })}
          />
          {errors.cur_job_position && (
            <p className="text-[#FF2222] text-base">
              {errors.cur_job_position.message}
            </p>
          )}
        </div>
      </div>

      {/*Input company address*/}
      <div className="flex flex-col mt-4">
        <p className="text-base font-semibold text-white mb-2">
          {t('RefereePage.company_address')}
        </p>
        <div className="flex flex-col lg:flex-row w-full gap-1 lg:gap-2">
          {/* Select city */}
          <div className="flex flex-row w-full lg:w-1/2 gap-1 lg:gap-2">
            <div className="relative lg:w-1/4 flex-1 min-w-0">
              <select
                id="selectCity"
                className="bg-[#F0F0F0] h-[48px] font-normal text-base text-[#212121] appearance-none w-full pl-2"
                {...formData('cur_job_work_city')}
              >
                <option value="" disabled>
                  {t('RefereePage.city')}
                </option>
                {cityList.map((item, index) => (
                  <option key={index} value={item.id} className="text-black">
                    {locale === 'cn' ? item.name : item.en_name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Icon
                  icon="dropdown-arrow"
                  width={16}
                  height={16}
                  classNames="icon"
                />
              </div>
              {errors.cur_job_work_city && (
                <p className="text-[#FF2222] text-base">
                  {errors.cur_job_work_city.message}
                </p>
              )}
            </div>
            {/* Select district */}
            <div className="relative lg:w-1/4 flex-1 min-w-0">
              <select
                id="selectDistrict"
                className="bg-[#F0F0F0] h-[48px] font-normal text-base text-[#212121] appearance-none w-full pl-2"
                {...formData('cur_job_work_district')}
              >
                <option value="" disabled>
                  {t('RefereePage.district')}
                </option>
                {companyDistrictList.map((item, index) => (
                  <option key={index} value={item.id} className="text-black">
                    {locale === 'cn' ? item.name : item.en_name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Icon
                  icon="dropdown-arrow"
                  width={16}
                  height={16}
                  classNames="icon"
                />
              </div>
              {errors.cur_job_work_district && (
                <p className="text-[#FF2222] text-base">
                  {errors.cur_job_work_district.message}
                </p>
              )}
            </div>
          </div>
          {/* Input Field */}
          <div className="w-full lg:w-1/2">
            <input
              type="text"
              id="workplaceaddress"
              name="workplaceaddress"
              placeholder={`${t('RefereePage.place_holder')} ${t(
                'RefereePage.workplace_address'
              )}`}
              className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
              {...formData('cur_job_work_street')}
            />
            {errors.cur_job_work_street && (
              <p className="text-[#FF2222] text-base">
                {errors.cur_job_work_street.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentOccupation
