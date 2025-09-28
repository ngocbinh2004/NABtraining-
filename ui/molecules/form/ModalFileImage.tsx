import { MutableRefObject, RefObject, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'

// ui
import Button from '@/atoms/Button'
import InputRange from '@/molecules/form/InputRange'

interface IProps {
  src?: string
  isSquare?: boolean
  handleClose: (...args: any) => any
  onChange: (...args: any) => any
}

export default function ModalFileImage({
  src,
  handleClose,
  onChange,
  isSquare,
}: IProps) {
  const [slideValue, setSlideValue] = useState(10)
  const cropRef = useRef<any>(null)

  const handleSave = async () => {
    if (cropRef?.current) {
      const cropImage = cropRef?.current?.getImage()
      const dataUrl = cropImage?.toDataURL()
      // const image = await fetch(dataUrl)
      onChange(dataUrl)
      handleClose()
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <AvatarEditor
        ref={cropRef}
        image={src}
        style={{ width: '100%', height: '100%' }}
        border={50}
        borderRadius={isSquare ? 0 : 150}
        color={[0, 0, 0, 0.72]}
        scale={slideValue / 10}
        rotate={0}
      />
      <InputRange
        name="zoom"
        label="Zoom Level"
        value={slideValue}
        min={10}
        handleChange={(zoom: number) => setSlideValue(zoom)}
      />
      <div className="flex gap-2">
        <Button size="sm" type="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button size="sm" type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
