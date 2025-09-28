import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import { NextPage } from 'next'
import Image from '@/molecules/media/Image'
import Icon from '@/atoms/Icon'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ICityType } from 'interfaces/city_type'
import { useRouter } from 'next/router'
import { IDistrictType } from 'interfaces/district_type'

type Props = {
  formData: any
  errors: any
  setValue: any
  getValues: any
  watch: any
  cityList: ICityType[]
}

const PersonalInformation: NextPage<Props> = ({
  formData,
  errors,
  setValue,
  getValues,
  watch,
  cityList,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const locale = router.locale

  const selectedResidentialCity =
    Number(watch('residential_city')) || cityList[0] ? cityList[0].id : 0
  const [residentialDistrictList, setResidentialDistrictList] = useState<
    IDistrictType[]
  >(
    selectedResidentialCity
      ? cityList.filter((item) => item.id === selectedResidentialCity)[0]
          .districts
      : []
  )
  const selectedContactCity =
    Number(watch('mailing_city')) || cityList[0] ? cityList[0].id : 0
  const [contactDistrictList, setContactDistrictList] = useState<
    IDistrictType[]
  >(
    selectedContactCity
      ? cityList.filter((item) => item.id === selectedContactCity)[0].districts
      : []
  )
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    'Chinese'
  )
  const [selectedIDDocument, setSelectedIDDocument] = useState<string | null>(
    'IDcard'
  )

  const [refereeImage, setImage] = useState<string>('')
  const [isCheck, setIsCheck] = useState<boolean>(false)
  const portraitPhoto = watch('portrait_photo')
  const [startDate, setStartDate] = useState<Date | null>(null)

  const handleDateChange = (date: Date) => {
    setStartDate(date)
    setValue('birthdate', date)
  }
  const handleDatePicker = () => {
    document.getElementById('birthdate')?.focus()
  }

  const handleCheckBoxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsCheck(event.target.checked)
    setValue('mailing_street', getValues('residential_street').toString())
    await setValue('mailing_city', getValues('residential_city').toString())
    setValue('mailing_district', getValues('residential_district').toString())
  }

  const handleFileChange = useCallback(async () => {
    if (portraitPhoto) {
      const file = getValues('portrait_photo')?.[0]
      if (file && file instanceof Blob) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImage(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }, [portraitPhoto, getValues])

  useEffect(() => {
    handleFileChange()
  }, [handleFileChange])

  useEffect(() => {
    if (selectedResidentialCity) {
      const filteredCities = cityList.filter(
        (item) => item.id === selectedResidentialCity
      )
      setResidentialDistrictList(filteredCities)
    } else {
      setResidentialDistrictList([])
    }
  }, [selectedResidentialCity, cityList])

  useEffect(() => {
    if (selectedContactCity) {
      const filteredCities = cityList.filter(
        (item) => item.id === selectedContactCity
      )
      setContactDistrictList(filteredCities)
    } else {
      setContactDistrictList([])
    }
  }, [selectedContactCity, cityList])

  if (!formData || !cityList) return <></>

  return (
    <div className="w-full h-auto lg:max-w-[960px] lg:max-h-[1404px] my-10 mx-auto">
      <p className="w-full lg:w-[720px] h-auto text-white leading-[150%] font-semibold text-xl lg:text-2xl">
        {t('RefereePage.personal_information')}
      </p>
      <hr className="w-full border-t border-white mb-6 mt-4" />
      <div className="w-full lg:w-[780px] flex flex-col-reverse lg:flex-row lg:flex-wrap justify-between mt-2 gap-4 lg:gap-6 mb-4 lg:mb-12 h-auto">
        <div className="w-full h-auto lg:w-[500px] lg:h-[324px]">
          {/*Input first and last name*/}
          <div className="flex flex-col w-full">
            <p className="block mb-2 text-base font-semibold text-white">
              {t('RefereePage.name')}
            </p>
            <div className="flex flex-wrap items-center mb-2 gap-1 lg:gap-2">
              <span
                className={`w-[80px] h-[48px] flex items-center justify-center cursor-pointer py-2 px-5 text-base font-medium ${
                  selectedLanguage === 'Chinese'
                    ? 'bg-[#009619] text-white'
                    : 'bg-[#E9E9E9] text-[#6B6B6B]'
                }`}
                onClick={() => setSelectedLanguage('Chinese')}
              >
                {t('RefereePage.chinese')}
              </span>
              <span
                className={`w-[80px] h-[48px] flex items-center justify-center cursor-pointer py-2 px-5 text-base font-medium ${
                  selectedLanguage === 'English'
                    ? 'bg-[#009619] text-white'
                    : 'bg-[#E9E9E9] text-[#6B6B6B]'
                }`}
                onClick={() => setSelectedLanguage('English')}
              >
                {t('RefereePage.english')}
              </span>
            </div>
            {selectedLanguage === 'English' && (
              <div className="flex w-full gap-1 lg:gap-2">
                <div className="flex flex-col w-1/2">
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder={t('RefereePage.first_name')}
                    className="p-2 h-[48px] font-normal text-base bg-[#F0F0F0]"
                    {...formData('english_fname', {
                      required: t('RefereePage.first_name_required'),
                    })}
                  />
                  {errors.english_fname ? (
                    <p className="text-[#FF2222] text-base text-wrap">
                      {errors.english_fname?.message}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col w-1/2">
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder={t('RefereePage.last_name')}
                    className="p-2 h-[48px] font-normal text-base bg-[#F0F0F0]"
                    {...formData('english_lname', {
                      required: t('RefereePage.last_name_required'),
                    })}
                  />
                  {errors.english_lname ? (
                    <p className="text-[#FF2222] text-base text-wrap">
                      {errors.english_lname?.message}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
            {selectedLanguage === 'Chinese' && (
              <div className="flex flex-1 w-full gap-1 lg:gap-2">
                <div className="flex flex-col w-1/2">
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder={t('RefereePage.last_name')}
                    className="p-2 h-[48px] font-normal text-base bg-[#F0F0F0]"
                    {...formData('chinese_lname', {
                      required: t('RefereePage.last_name_required'),
                    })}
                  />
                  {errors.chinese_lname ? (
                    <p className="text-[#FF2222] text-base text-wrap">
                      {errors.chinese_lname?.message}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col w-1/2">
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder={t('RefereePage.first_name')}
                    className="p-2 h-[48px] font-normal text-base bg-[#F0F0F0]"
                    {...formData('chinese_fname', {
                      required: t('RefereePage.first_name_required'),
                    })}
                  />
                  {errors.chinese_fname ? (
                    <p className="text-[#FF2222] text-base text-wrap">
                      {errors.chinese_fname?.message}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </div>
          {/*Input gender*/}
          <div className="flex flex-col w-full">
            <p className="block mb-2 text-base font-semibold text-white mt-4">
              {t('RefereePage.gender')}
            </p>
            <div className="flex flex-wrap items-center gap-1 lg:gap-2">
              <div>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  defaultChecked
                  {...formData('gender', { required: true })}
                  className="hidden peer/male"
                />
                <label
                  htmlFor="male"
                  className={`w-[80px] h-[48px] flex items-center justify-center cursor-pointer py-2 px-5 text-base font-medium bg-[#E9E9E9] text-[#6B6B6B] peer-checked/male:bg-[#009619] peer-checked/male:text-white`}
                >
                  {t('RefereePage.gender_male')}
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  {...formData('gender', { required: true })}
                  className="hidden peer/female"
                />
                <label
                  htmlFor="female"
                  className={`w-[80px] h-[48px] flex items-center justify-center cursor-pointer py-2 px-5 text-base font-medium bg-[#E9E9E9] text-[#6B6B6B] peer-checked/female:bg-[#009619] peer-checked/female:text-white`}
                >
                  {t('RefereePage.gender_female')}
                </label>
              </div>
            </div>
          </div>
          {/*Input date of birth*/}
          <div className="flex flex-col w-full h-full">
            <p className="block mb-2 text-base font-semibold text-white mt-4">
              {t('RefereePage.date_of_birth')}
            </p>
            <div
              id="birthdate-input"
              className="flex flex-row items-center justify-between w-full h-auto bg-[#F0F0F0] pr-3"
              onClick={handleDatePicker}
            >
              <DatePicker
                id="birthdate"
                selected={startDate ? startDate : null}
                onChange={handleDateChange}
                placeholderText="YYYY/MM/DD"
                dateFormat="yyyy/MM/dd"
                className="border p-2 w-full max-h-[42px] text-base font-medium bg-[#F0F0F0] placeholder-[#A8A8A8]"
                customInput={
                  <input
                    name="birthdate"
                    type="text"
                    {...formData('birthdate', {
                      validate: () => {
                        if (!startDate)
                          return t('RefereePage.birthdate_required')
                        else {
                          const today = new Date()
                          const birthdate = new Date(startDate)
                          if (birthdate > today) {
                            return t('RefereePage.birthdate_invalid')
                          }
                        }
                      },
                    })}
                  />
                }
              />
              <Image
                url="assets/calendar.png"
                alt="Calendar Icon"
                width={25}
                height={29}
              />
            </div>
            {errors.birthdate ? (
              <p className="text-[#FF2222] text-base">
                {errors.birthdate.message}
              </p>
            ) : null}
          </div>
        </div>
        {/*Input photo*/}
        <div className="w-full h-[324px] p-6 lg:w-[248px] lg:h-[324px] flex flex-col justify-center items-center bg-[#004F36] gap-4">
          {errors.portrait_photo && (
            <p className="text-[#FF2222] text-base text-nowrap">
              {errors.portrait_photo.message}
            </p>
          )}
          <input
            type="file"
            id="file"
            className="hidden"
            {...formData('portrait_photo', {
              required: t('RefereePage.portrait_photo_required'),
            })}
          />
          {refereeImage ? (
            <Image
              alt="Referee Image"
              url={refereeImage}
              classNames="w-full h-[236px] lg:h-[212px]"
            />
          ) : (
            <div className="w-full bg-[#F0F0F0] h-[236px] lg:h-[212px] flex justify-center items-center">
              <p className="justify-center text-center text-[#979797] font-normal text-sm w-full h-auto lg:w-[200px] lg:h-[42px]">
                {t('RefereePage.attach_desc1')} <br />
                {t('RefereePage.attach_desc2')}
              </p>
            </div>
          )}
          <label
            htmlFor="file"
            className="bg-[#009619] text-white font-medium text-base px-4 py-2 w-full h-[48px] flex justify-center items-center cursor-pointer"
          >
            <span className="text-sm lg:text-lg">
              {t('RefereePage.upload_file')}
            </span>
          </label>
        </div>
      </div>
      {/*Input residential address*/}
      <div className="flex flex-col">
        <p className="text-base font-semibold text-white mb-2">
          {t('RefereePage.residential_address')}
        </p>
        <div className="flex flex-col lg:flex-row w-full gap-1 lg:gap-2">
          {/* Select city */}
          <div className="flex flex-row w-full lg:w-1/2 gap-1 lg:gap-2">
            <div className="flex flex-col min-w-0 lg:w-1/4 flex-1">
              <div className="relative w-full">
                <select
                  id="selectCity"
                  className="bg-[#F0F0F0] h-[48px] font-normal text-base text-[#212121] appearance-none w-full pl-2"
                  {...formData('residential_city')}
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
              </div>
              {errors.residential_city ? (
                <p className="text-[#FF2222] text-base">
                  {errors.residential_city?.message}
                </p>
              ) : null}
            </div>

            {/* Select district */}
            <div className="flex flex-col min-w-0 lg:w-1/4 flex-1">
              <div className="relative w-full">
                <select
                  id="selectDistrict"
                  className="bg-[#F0F0F0] h-[48px] font-normal text-base text-[#212121] appearance-none w-full pl-2"
                  {...formData('residential_district')}
                >
                  <option value="" disabled>
                    {t('RefereePage.district')}
                  </option>
                  {residentialDistrictList.map((item, index) => (
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
              </div>
              {errors.residential_district ? (
                <p className="text-[#FF2222] text-base">
                  {errors.residential_district?.message}
                </p>
              ) : null}
            </div>
          </div>
          {/* Input Field */}
          <div className="w-full lg:w-1/2">
            <input
              type="text"
              id="residentialadsress"
              name="residentialadsress"
              placeholder={`${t('RefereePage.place_holder')}${t(
                'RefereePage.residential_street'
              )}`}
              className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
              {...formData('residential_street')}
            />
            {errors.residential_street ? (
              <p className="text-[#FF2222] text-base">
                {errors.residential_street.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/*Input mailing address*/}
      <div className="flex flex-col mt-4">
        <p className="text-base font-semibold text-white mb-2">
          {t('RefereePage.mailing_address')}
        </p>
        <div className="flex flex-col lg:flex-row w-full gap-1 lg:gap-2">
          {/* Select city */}
          <div className="flex flex-row w-full lg:w-1/2 gap-1 lg:gap-2">
            <div className="flex flex-col min-w-0 lg:w-1/4 flex-1">
              <div className="relative w-full">
                <select
                  id="selectCity"
                  className="bg-[#F0F0F0] h-[48px] font-normal text-base text-[#212121] appearance-none w-full pl-2"
                  disabled={isCheck}
                  {...formData('mailing_city')}
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
              </div>
              {errors.mailing_city ? (
                <p className="text-[#FF2222] text-base">
                  {errors.mailing_city.message}
                </p>
              ) : null}
            </div>
            {/* Select district */}
            <div className="flex flex-col min-w-0 lg:w-1/4 flex-1">
              <div className="relative w-full">
                <select
                  id="selectDistrict"
                  className="bg-[#F0F0F0] h-[48px] font-normal text-base text-[#212121] appearance-none w-full pl-2"
                  disabled={isCheck}
                  {...formData('mailing_district')}
                >
                  <option value="" disabled>
                    {t('RefereePage.district')}
                  </option>
                  {contactDistrictList.map((item, index) => (
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
              </div>
              {errors.mailing_district ? (
                <p className="text-[#FF2222] text-base">
                  {errors.mailing_district.message}
                </p>
              ) : null}
            </div>
          </div>
          {/* Input Field */}
          <div className="w-full lg:w-1/2">
            <input
              type="text"
              id="mailingaddress"
              name="mailingaddress"
              placeholder={`${t('RefereePage.place_holder')}${t(
                'RefereePage.mailing_street'
              )}`}
              disabled={isCheck}
              className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
              {...formData('mailing_street')}
            />
            {errors.mailing_street ? (
              <p className="text-[#FF2222] text-base">
                {errors.mailing_street.message}
              </p>
            ) : null}
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex justify-start md:justify-end items-center mt-2 ">
          <input
            type="checkbox"
            id="mailing"
            name="mailing"
            checked={isCheck}
            onChange={handleCheckBoxChange}
            className="mr-2 accent-[#009619] w-5 h-5"
          />
          <p className="text-base font-medium text-white">
            {t('RefereePage.same_residential_address')}
          </p>
        </div>
      </div>

      {/*Input id document*/}
      <div className="flex flex-col">
        <p className="mr-2 text-base font-semibold text-white mt-4 mb-2">
          {t('RefereePage.upload_id_document')}
        </p>
        <div className="flex flex-wrap items-center mb-2 gap-1 lg:gap-2">
          <span
            className={`w-[112px] h-[48px] flex items-center justify-center cursor-pointer py-3 px-4 text-base font-medium ${
              selectedIDDocument === 'IDcard'
                ? 'bg-[#009619] text-white'
                : 'bg-[#E9E9E9] text-[#6B6B6B]'
            }`}
            onClick={() => setSelectedIDDocument('IDcard')}
          >
            {t('RefereePage.id_card')}
          </span>
          <span
            className={`w-[112px] h-[48px] flex items-center justify-center cursor-pointer py-3 px-4 text-base font-medium ${
              selectedIDDocument === 'Passport'
                ? 'bg-[#009619] text-white'
                : 'bg-[#E9E9E9] text-[#6B6B6B]'
            }`}
            onClick={() => setSelectedIDDocument('Passport')}
          >
            {t('RefereePage.passport')}
          </span>
        </div>
        <input
          type="text"
          id="idnumber"
          name="idnumber"
          placeholder={t('RefereePage.id_number')}
          className="p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
          {...formData('id_documents', {
            required: t('RefereePage.id_number_required'),
          })}
        />
        {errors.id_documents ? (
          <p className="text-[#FF2222] text-base">
            {errors.id_documents.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-2">
        {/*Input contact phone number*/}
        <div className="w-full lg:w-1/2">
          <p className="block mb-2 text-base font-semibold text-white mt-4">
            {t('RefereePage.contact_phone_numbers')}
          </p>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder={t('RefereePage.please_enter_your_phone')}
            className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
            {...formData('mobile', {
              required: t('RefereePage.phone_number_required'),
              pattern: {
                value: /^[0-9]{10}$/,
                message: t('RefereePage.phone_number_invalid'),
              },
            })}
          />
          {errors.mobile ? (
            <p className="text-[#FF2222] text-base">{errors.mobile?.message}</p>
          ) : null}
        </div>

        {/*Input email addresss*/}
        <div className="w-full lg:w-1/2">
          <p className="text-base font-semibold text-white mt-4 mb-2">
            {t('RefereePage.email_address')}
          </p>
          <input
            type="email"
            id="email"
            name="email"
            placeholder={t('RefereePage.please_enter_your_email')}
            className="border p-2 w-full h-[48px] font-medium text-lg bg-[#EDEDED]"
            {...formData('email', {
              required: t('RefereePage.email_required'),
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email ? (
            <p className="text-[#FF2222] text-base">{errors.email.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default PersonalInformation
