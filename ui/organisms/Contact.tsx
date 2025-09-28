import Text from '@/atoms/Text'
import Line from '@/atoms/Line'

export default function Contact() {
  return (
    <div className="wl-contact-detail flex flex-col">
      <Line classNames="my-20" />
      <Text size="h1">Contact Us</Text>
      <div className="wl-faq__contact w-full flex flex-col gap-2 mt-10">
        <Text size="h2">Wei Xu</Text>
        <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>
          {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
        </a>
        {/* <a href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE}`}>
          {process.env.NEXT_PUBLIC_CONTACT_PHONE}
        </a> */}
      </div>
    </div>
  )
}
