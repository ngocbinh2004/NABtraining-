import { useEffect } from 'react'

import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import CardWrapper from '@/organisms/card/Wrapper'

import { useOverflowBody } from 'hooks/useOverflowBody'

interface Props {
  showModal?: boolean
  handlePopModal?: (...args: any) => any
  children?: React.ReactNode
}

export function ModalWrapper({ showModal, children, handlePopModal }: Props) {
  useOverflowBody({ hideOverflow: !!showModal })

  return (
    <div className="wl-modal">
      {showModal && (
        <div
          id="modal-overlay"
          className="wl-modal__overlay fixed flex w-screen h-screen items-center justify-center text-black bg-white-900 top-0 left-0 z-[100] overflow-hidden"
          onClick={(e: any) => {
            const overlayClicked = e?.target && e?.target?.id === 'modal-overlay'
            if (overlayClicked && handlePopModal) {
              handlePopModal()
            }
          }}>
          {children}
        </div>
      )}
    </div>
  )
}

interface ModalOkProps {
  showModal?: boolean
  title: string
  message?: string
  handleCloseModal?: (...args: any) => any
  labelOk: string
}

export function ModalOk({
  title,
  message,
  handleCloseModal,
  showModal,
  labelOk,
}: ModalOkProps) {
  return (
    <ModalWrapper showModal={showModal}>
      <CardWrapper
        noPadding
        classNames="wl-modal-ok wl-modal__content w-[80vw] h-[80vh] md:w-[600px] md:h-[300px] p-6 md:p-10 flex flex-col justify-between z-90"
        name="confirm-modal"
      >
        <Text size="h1">{title}</Text>
        <Text>{message}</Text>
        <div className="self-center w-full text-center">
          <Button type="primary" size="lg" onClick={handleCloseModal}>
            {labelOk}
          </Button>
        </div>
      </CardWrapper>
    </ModalWrapper>
  )
}

interface ModalConfirmationProps {
  showModal?: boolean
  title: string
  message?: string
  handleCloseModal?: (...args: any) => any
  handleOk?: (...args: any) => any
  labelOk: string
  labelCancel?: string
}

export function ModalConfirmation({
  title,
  message,
  handleCloseModal,
  handleOk,
  showModal,
  labelOk,
  labelCancel = 'Cancel',
}: ModalConfirmationProps) {
  return (
    <ModalWrapper showModal={showModal}>
      <CardWrapper
        noPadding
        classNames="wl-modal-confirmation wl-modal__content w-[80vw] h-fit md:w-[600px] md:h-[300px] p-6 md:p-10 flex flex-col justify-between"
        name="confirm-modal"
      >
        <Text size="h1">{title}</Text>
        <Text>{message}</Text>
        <div className="self-center w-full text-center flex gap-4 mt-4">
          <Button type="secondary" size="lg" onClick={handleCloseModal}>
            {labelCancel}
          </Button>
          <Button type="primary" size="lg" onClick={handleOk}>
            {labelOk}
          </Button>
        </div>
      </CardWrapper>
    </ModalWrapper>
  )
}
