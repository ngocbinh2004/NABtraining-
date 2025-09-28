import { toast } from 'react-toastify'
import { cx } from 'class-variance-authority'
import { useState } from 'react'

// ui
import Text from '@/atoms/Text'

// context
import { useModalDispatch } from 'context/modalContext'

// helpers
import { convertBase64 } from 'helpers/convertBase64'

// constants
import { modalName, TModalAction } from 'constants/modal'

/* eslint-disable @next/next/no-img-element */
interface Props {
  image?: string
  onChange: (...args: any) => any
  maxSizeInKB?: number
  tabIndex?: number
  isSquare?: boolean
}

// default 1MB
export default function InputFileImage({
  maxSizeInKB = 1000,
  image,
  onChange,
  tabIndex,
  isSquare,
}: Props) {
  // State
  const [src, setSrc] = useState<string | null>(null)

  // Context
  const dispatch = useModalDispatch()

  // Function
  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = ((event?.target as HTMLInputElement)?.files as FileList)?.[0]

    if (maxSizeInKB && file?.size > maxSizeInKB * 1000) {
      return toast.error(`File is bigger than ${maxSizeInKB / 1000}MB`)
    }

    const base64 = await convertBase64(file)
    setSrc(`${base64 || ''}`)
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.EDIT_IMAGE,
      data: {
        isSquare,
        onChange: (logo: any) => onChange(logo),
        src: base64,
      },
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-[100px] h-[100px] rounded-full cursor-pointer"
      >
        <div className="flex flex-col items-center mx-auto justify-center w-full h-full">
          {image ? (
            <img
              alt="preview-image"
              src={image}
              width={100}
              height={100}
              className={cx(
                'object-cover w-full h-full border-2',
                isSquare ? 'rounded-lg' : 'rounded-full '
              )}
            />
          ) : (
            <>
              {isSquare ? (
                <div
                  className={cx('border rounded-lg', 'w-[100px] h-[100px]')}
                ></div>
              ) : (
                <svg
                  viewBox="0 0 40 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7 20C7 13.0964 12.5964 7.5 19.5 7.5C22.8152 7.5 25.9946 8.81696 28.3388 11.1612C30.683 13.5054 32 16.6848 32 20C32 26.9036 26.4036 32.5 19.5 32.5C12.5964 32.5 7 26.9036 7 20ZM19.4929 11.9556C17.0273 11.9556 15.0286 13.9543 15.0286 16.4199C15.0286 18.8854 17.0273 20.8841 19.4929 20.8841C21.9584 20.8841 23.9572 18.8854 23.9572 16.4199C23.9572 13.9543 21.9584 11.9556 19.4929 11.9556ZM19.4929 19.0984C18.0136 19.0984 16.8143 17.8992 16.8143 16.4199C16.8143 14.9405 18.0136 13.7413 19.4929 13.7413C20.9722 13.7413 22.1715 14.9405 22.1715 16.4199C22.1715 17.8992 20.9722 19.0984 19.4929 19.0984ZM14.1429 29.2679V27.4821C14.0613 25.9133 15.2541 24.5695 16.8215 24.4643H22.1786C23.7497 24.5695 24.9438 25.9189 24.8572 27.4911V29.2768C21.5462 31.2056 17.4539 31.2056 14.1429 29.2768V29.2679ZM26.6429 27.4196V27.9464C29.954 24.9849 31.0941 20.2873 29.509 16.1374C27.9239 11.9875 23.9423 9.24619 19.5 9.24619C15.0577 9.24619 11.0761 11.9875 9.49103 16.1374C7.90591 20.2873 9.04606 24.9849 12.3572 27.9464V27.4196C12.3017 24.8857 14.2887 22.7754 16.8214 22.6786H22.1786C24.7092 22.7801 26.6935 24.8875 26.6429 27.4196Z"
                    fill="#A9A9A9"
                  />
                </svg>
              )}
            </>
          )}
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={uploadImage}
          tabIndex={tabIndex}
        />
      </label>
      {maxSizeInKB && (
        <Text classNames="font-[12px]">* Max size {maxSizeInKB / 1000}MB</Text>
      )}
    </div>
  )
}
