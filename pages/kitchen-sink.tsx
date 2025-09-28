import { useState } from 'react'
import DatePicker from 'react-datepicker'

import Button from '@/atoms/Button'
import Icon from '@/atoms/Icon'
import Link from '@/atoms/Link'
import ButtonIcon from '@/atoms/ButtonIcon'
import Pill from '@/atoms/Pill'
import Line from '@/atoms/Line'
import Text from '@/atoms/Text'

import LinkText from '@/molecules/LinkText'
import Tab from '@/molecules/tab/Tab'
import Input from '@/molecules/form/Input'
import Checkbox from '@/molecules/form/Checkbox'
import InputNumber from '@/molecules/form/InputNumber'
import Select from '@/molecules/form/Select'
import Search from '@/molecules/Search'
import VerticalSteps from '@/molecules/VerticalSteps'
import Image from '@/molecules/media/Image'
import Video from '@/molecules/media/Video'

import Header from '@/organisms/Header'
import CardCompetition from '@/organisms/card/Competition'
import CardBuyNow from '@/organisms/card/ticket/BuyNow'
import CardUnpaid from '@/organisms/card/ticket/Unpaid'
import CardTeam from '@/organisms/card/Team'
import CardSlider from '@/organisms/CardSlider'
import MediaCarousel from '@/organisms/MediaCarousel'
import TrAnimated from '@/organisms/TrAnimated'
import CardEditTeam from '@/organisms/card/account/EditTeam'
import CardPurchase from '@/organisms/card/ticket/Purchase'
import CardEditAccount from '@/organisms/card/account/EditAccount'
import CardNews from '@/organisms/card/information/News'
import CardVideo from '@/organisms/card/information/Video'
import CardPhoto from '@/organisms/card/information/Photo'
import Pagination from '@/molecules/Pagination'
import InputDatepicker, {
  InputDateRangePicker,
} from '@/molecules/form/InputDatepicker'
import { eventStatus } from 'constants/gameStatus'

const today = new Date().toISOString().split('T')[0]
const IMAGE_URL =
  'https://thumbs.dreamstime.com/b/colorful-rocks-salthill-beach-focus-blackrodk-diving-board-out-sun-rise-time-flare-cloudy-sky-nobody-galway-city-ireland-217606320.jpg'
const VIDEO_URL = 'https://www.youtube.com/embed/P_pOQtj32iY'

export default function KitchenSink() {
  const [activeTab, setActiveTab] = useState('0')

  const [selectedOption, setSelectedOption] = useState('')

  const [startDate, setStartDate] = useState(new Date())

  // range picker
  const [startRange, setStartRange] = useState(new Date())
  const [endRange, setEndRange] = useState(new Date())

  const [activeTr, setActiveTr] = useState(0)

  const handleTabChange = (id: string) => {
    setActiveTab(id)
  }

  return (
    <div className="bg-linear-background px-5 md:px-10 py-20">
      <Header />
      <Line classNames="my-4" />
      <Pagination
        size={10}
        totalResult={97}
        page={2}
        handleChange={() => null}
      />
      <div className="flex flex-col">
        <Checkbox label="I agree" checked value="tes" onChange={() => null} />
        <Checkbox label="Oke" value="tos" onChange={() => null} />
        <div className="font-input text-input-placeholder--sm lg:text-input-placeholder text-semibold placeholder:font-input placeholder:text-input-placeholder--sm placeholder:lg:font-input placeholder:lg:text-input-placeholder  placeholder:text-gray-300 text-form-input">
          <InputDatepicker
            date={startDate}
            onChange={(d: any) => setStartDate(d)}
            showTimeSelect
            name="dtp1"
            label="label"
            error="error"
            dateFormat="yyyy/MM/dd HH:mm"
            placeholder="yyyy/MM/dd HH:mm"
          />
          <div className="flex gap-4 w-fit">
            <InputDateRangePicker
              startDate={{
                date: startDate,
                onChange: (d: any) => setStartRange(d),
                showTimeSelect: true,
                name: 'rangeStart',
                label: 'Start Date',
                error: 'Error Start Date',
                dateFormat: 'yyyy/MM/dd HH:mm',
                placeholder: 'yyyy/MM/dd HH:mm',
              }}
              endDate={{
                date: endRange,
                onChange: (d: any) => setEndRange(d),
                showTimeSelect: true,
                name: 'rangeEnd',
                label: 'End Date',
                error: 'Error End Date',
                dateFormat: 'yyyy/MM/dd HH:mm',
                placeholder: 'yyyy/MM/dd HH:mm',
              }}
            />
          </div>
          {/* Range picker new */}
          <DatePicker
            selected={startDate}
            onChange={(d: any) => setStartDate(d)}
            showTimeSelect
            dateFormat="yyyy/MM/dd HH:mm"
            placeholderText="tes"
          />
        </div>
      </div>
      <h1>Slider (for scoreboard)</h1>
      <Line classNames="my-4" />
      <div className="w-full lg:w-[70vw] flex flex-col">
        {['Pupu', 'Pergi', 'Ke Pasar', 'Nah loh', 'Gembul'].map((tr, idx) => (
          <TrAnimated isActive={activeTr === idx} key={tr} classNames="flex">
            {`Tes ${idx} : ${tr}`}
            <div className="wl-tr-animated__arrow translate-x-0 opacity-0 w-fit">
              <Icon
                icon="table-arrow"
                width={26}
                height={27}
                classNames="text-white"
              />
            </div>
          </TrAnimated>
        ))}
      </div>

      <Line classNames="my-4" />
      <h1>Vertical Steps</h1>
      <div className="w-full lg:w-[427px]">
        <VerticalSteps
          steps={[
            'Please go to your mailbox to receive the verification letter.',
            'Please click on the URL in the email to proceed with mailbox verification.',
          ]}
        />
      </div>
      <Line classNames="my-4" />

      {/* START: Button */}
      <h1>Button</h1>
      <div className="flex flex-col gap-2">
        <Button size="md" type="primary">
          Login / Sign Up
        </Button>
        <Button size="sm" type="primary">
          Send to Email
        </Button>
        <div className="flex gap-1">
          <Button size="sm" type="ghost">
            More
          </Button>
          <Button size="sm" type="primary" onClick={() => null}>
            Register
          </Button>
        </div>
        <Button size="lg" type="primary">
          Register
        </Button>
        <Button size="xl" type="primary">
          Go Back to Tickets
        </Button>
      </div>
      {/* END: Button */}
      <Line classNames="my-4" />
      <h1>ButtonIcon</h1>
      <ButtonIcon onClick={() => null} type="decrease" />
      <ButtonIcon onClick={() => null} type="increase" />
      <Line classNames="my-4" />
      <h1>Pill</h1>
      <Pill>Live</Pill>
      <Line classNames="my-4" />
      <h1>Link Text</h1>
      <LinkText href="/tes">See more</LinkText>
      <Line classNames="my-4" />
      <h1>Tab</h1>
      <div className="flex flex-row gap-2">
        <Tab
          type="text"
          name="tab-text"
          onClick={(id) => handleTabChange(id)}
          activeTab={activeTab}
          tabs={[
            { id: '0', name: 'SEA' },
            { id: '1', name: 'South American Cup' },
            { id: '2', name: 'South East Asian Cup' },
          ]}
        >
          <div className="p-10 text-white">{`Ceritanya tab contnet text ke - ${activeTab}`}</div>
        </Tab>
      </div>
      <Line classNames="my-4" />
      <div className="flex flex-row gap-2.5 flex-wrap">
        <Tab
          type="button"
          name="tab-competition"
          onClick={(id) => handleTabChange(id)}
          activeTab={activeTab}
          tabs={[
            { id: '0', name: 'SEA' },
            { id: '1', name: 'South American Cup' },
            { id: '2', name: 'South East Asian Cup' },

            { id: '3', name: 'Thailand Cup' },
            { id: '4', name: 'Taiwan Cup' },
            { id: '5', name: 'Singapore Cup' },
            { id: '6', name: 'University Cup' },
          ]}
        >
          <div className="p-10 text-white">{`Ceritanya tab contnet ke - ${activeTab}`}</div>
        </Tab>
        <Line classNames="my-4" />
        <Search placeholder="search here" onClick={(search) => alert(search)} />
        <Line classNames="my-4" />
        <InputNumber value={1} handleChange={() => null} />
        <Line classNames="my-4" />
        <div className="flex flex-col w-full md:w-auto bg-green-400 p-5 md:p-10">
          <Text size="h1" classNames="text-white">
            Register
          </Text>
          <Line classNames="my-4 w-[40%]" />
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                type="text"
                tabIndex={2}
                onChange={() => null}
                placeholder="Please type First Name"
                name="firstname"
                label="First Name"
              />
              <Input
                type="text"
                tabIndex={3}
                onChange={() => null}
                placeholder="Please type Last Name"
                name="lastname"
                label="Last Name"
                error="Please input your last name"
              />
              <Input
                type="email"
                tabIndex={4}
                onChange={() => null}
                placeholder="Please type Your Email"
                name="email"
                label="Email"
              />
              <Select
                name="gender"
                tabIndex={6}
                onChange={(option: any) => setSelectedOption(option)}
                selectedOption={selectedOption}
                label="Gender"
                placeholder="Please input your gender"
                options={[
                  { label: 'Male', value: '0' },
                  { label: 'Female', value: '1' },
                ]}
              />
            </div>
            <div className="flex flex-row justify-center md:justify-end gap-5 mt-[72px]">
              <Button size="lg" type="secondary">
                Back
              </Button>
              <Button size="lg" type="primary">
                Register
              </Button>
            </div>
          </form>
        </div>
        <Line classNames="my-4" />
        <h1>Dynamic size image</h1>
        <Image
          withShadow
          isCircle
          alt="giant-rock"
          url={IMAGE_URL}
          width={250}
          height={250}
        />
        <Line classNames="my-4" />
        <h1>Video</h1>
        <Video
          classNames="w-fit h-fit rounded drop-shadow-media"
          url="https://www.youtube.com/embed/P_pOQtj32iY?rel=0;picture-in-picture"
          title="test video"
          description=""
        />
        <Line classNames="my-4" />
        <h1>
          Information - News Card (isCompact = homepage, else information/news )
        </h1>
        <br />
        <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-6">
          <CardNews
            id={1}
            url=""
            imageUrl={IMAGE_URL}
            title="News 1"
            date="21 Jan, 2023"
            isCompact
          />

          <CardNews
            url=""
            id={1}
            imageUrl={IMAGE_URL}
            title="News 2"
            date="21 Jan, 2023"
          />

          <CardNews
            id={1}
            url=""
            imageUrl={IMAGE_URL}
            title="News 3"
            date="21 Jan, 2023"
          />
        </div>
        <Line classNames="my-4" />
        <h1>Information - Photo Card</h1>
        <br />
        <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-6">
          <CardPhoto
            url={IMAGE_URL}
            title="【Week 13】2023/01/15 "
            content="Singapore Lions VS. Tailand Braves"
            date="21 Jan, 2023"
            eventName="Thailand Cup"
            eventUrl={IMAGE_URL}
          />
        </div>
        <br />
        <Line classNames="my-4" />
        <h1>Slider (for ticket card)</h1>
        <CardSlider name="slider-ticket-card" classNames="w-full">
          <CardBuyNow
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleBuy={() => null}
          />
          <CardBuyNow
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleBuy={() => null}
          />
          <CardBuyNow
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleBuy={() => null}
          />
          <CardBuyNow
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleBuy={() => null}
          />
        </CardSlider>
        <Line classNames="my-4" />
        <h1>Slider (for game card)</h1>
        <CardSlider name="slider-game-card" classNames="w-[800px]">
          <CardTeam
            url={IMAGE_URL}
            handleSeeMore={() => null}
            title="New Zealand"
            content="New Zealand Capybaras"
          />
          <CardTeam
            url={IMAGE_URL}
            handleSeeMore={() => null}
            title="Samudra Ganyang Tikus Pupu Pucino Alpupu Alpucino Land"
            content="Samudra Ganyang SihanoukvilleKotaAmpas"
          />
          <CardTeam
            url={IMAGE_URL}
            handleSeeMore={() => null}
            title="Singapore"
            content="Singapore Lions"
          />
          <CardTeam
            url={IMAGE_URL}
            handleSeeMore={() => null}
            title="Singapore"
            content="Singapore Lions"
          />
          <CardTeam
            url={IMAGE_URL}
            handleSeeMore={() => null}
            title="Singapore"
            content="Singapore Lions"
          />
          <CardTeam
            url={IMAGE_URL}
            handleSeeMore={() => null}
            title="Singapore"
            content="Singapore Lions"
          />
        </CardSlider>
        <Line classNames="my-4" />
        <h1>Purchase Card</h1>
        <br />
        <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-6">
          <CardPurchase
            title="Singapore Cup"
            qrUrl={IMAGE_URL}
            url={IMAGE_URL}
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleSendEmail={(_email) => null}
          />
          <CardPurchase
            title="Singapore Cup"
            qrUrl={IMAGE_URL}
            url={IMAGE_URL}
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            isSent
          />

          <CardPurchase
            title="Singapore Cup"
            qrUrl="/qr"
            url={IMAGE_URL}
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleSendEmail={(_email) => null}
          />

          <CardPurchase
            title="Singapore Cup"
            qrUrl={IMAGE_URL}
            url={IMAGE_URL}
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleSendEmail={(_email) => null}
          />
        </div>
        <Line classNames="my-4" />
        <h1>Unpaid Card</h1>
        <br />
        <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-6">
          <CardUnpaid
            title="Singapore Cup"
            url={IMAGE_URL}
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleDelete={() => null}
            handlePay={() => null}
          />
          <CardUnpaid
            title="Singapore Cup"
            url={IMAGE_URL}
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari Dimana ya gengs' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleDelete={() => null}
            handlePay={() => null}
          />
          <CardUnpaid
            title="Singapore Cup"
            url={IMAGE_URL}
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupucino' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleDelete={() => null}
            handlePay={() => null}
          />
          <CardUnpaid
            title="Singapore Cup"
            url={IMAGE_URL}
            contents={[
              { label: 'Time', content: '22/12/2022' },
              { label: 'Type', content: 'Adult' },
              { label: 'Location', content: 'Rumah Pupu Sari' },
              { label: 'Price', content: 'USD 5.0' },
            ]}
            handleDelete={() => null}
            handlePay={() => null}
          />
        </div>
        <div className="grid w-full grid-cols-1 lg:grid-cols-4 gap-6">
          <CardEditTeam
            // title="Samudra Pupu The Most Prestigious Cup WorldWide"
            // url={IMAGE_URL}
            contents={[
              { label: 'Team Name', content: 'Pukepo' },
              { label: 'Group', content: 'Adult' },
            ]}
            handleEditTeam={(_id) => null}
          />

          <CardEditTeam
            // title="Singapore Cup"
            // url={IMAGE_URL}
            contents={[
              { label: 'Team Name', content: 'Samoodra' },
              { label: 'Group', content: 'Adult' },
            ]}
            handleEditTeam={(_id) => null}
          />

          <CardEditTeam
            // title="Singapore Cup"
            // url={IMAGE_URL}
            contents={[
              { label: 'Team Name', content: 'Sapucil' },
              { label: 'Group', content: 'Baby' },
            ]}
            handleEditTeam={(_id) => null}
          />
          <CardEditTeam
            contents={[
              { label: 'Team Name', content: 'Poodra' },
              { label: 'Group', content: 'Young Adult' },
            ]}
            handleEditTeam={(_id) => null}
          />
          <CardEditTeam
            contents={[
              { label: 'Team Name', content: 'Sapucil Samoodra' },
              { label: 'Group', content: 'Elder' },
            ]}
            handleEditTeam={(_id) => null}
          />
        </div>
        <Line classNames="my-4" />
        <h1>CardCompetition</h1>
        <div className="flex w-full flex-col lg:flex-row gap-6">
          <CardCompetition
            url={IMAGE_URL}
            handleMore={() => null}
            handleRegister={() => null}
            title="Singapore Cup"
            content="Cup introductionCup introductionCup introductionCup introductionCup introductionCup introductionCup introduction."
            status={eventStatus.ON_GOING}
          />
          <CardCompetition
            url={IMAGE_URL}
            handleMore={() => null}
            handleRegister={() => null}
            title="Singapore Cup"
            content="Cup introductionCup introductionCup introductionCup introductionCup introductionCup introductionCup introduction."
            status={eventStatus.COMPLETED}
          />
        </div>
        <div className="flex w-full flex-col lg:flex-row gap-6">
          <CardTeam
            url={IMAGE_URL}
            handleSeeMore={() => null}
            title="Singapore"
            content="Singapore Lions"
          />
        </div>
        <Line classNames="my-4" />
        <h1>Edit Team</h1>
        <br />
        <div className="grid w-full gap-10">
          <CardEditAccount
            url={IMAGE_URL}
            title="Singapore High School Cup"
            onClick={() => null}
            buttonText="Upload"
            gridClassNames="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-11"
            contents={[
              { label: 'Group', content: 'High School' },
              { label: 'Registered', content: '10 teams' },
              { label: 'Deadline', content: '2023/04/03' },
              { label: 'Sort', content: 'Grade / Sex' },
              { label: 'Numbers', content: '120' },
              {
                label: 'Introduction',
                content:
                  'In order to strengthen the connection with departmental friends, the Department of Finance and Law of Chung',
                isSmall: true,
              },
              {
                label: 'Place',
                content: 'Singapore',
                isHoverable: true,
                hoverableText: 'Hoverable text for singapore',
              },
              {
                label: 'Moderated',
                content: '3 Teams',
                isHoverable: true,
                hoverableText: 'Hoverable text for 3 teams',
              },
            ]}
          />
          <CardEditAccount
            url={IMAGE_URL}
            title="Personal Information"
            onClick={() => null}
            buttonText="Edit"
            gridClassNames="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-11"
            contents={[
              { label: 'Name', content: 'Pupu' },
              { label: 'Gender', content: 'Female' },
              { label: 'Birth', content: '2023/04/03' },
            ]}
          />
        </div>
        <Line classNames="my-4" /> <Line classNames="my-4" />
        <Line classNames="my-4" />
        <h1>Media Carousel -- part 1</h1>
        <br />
        <div className="relative w-full lg:w-[800px]">
          <MediaCarousel name="slider-card">
            <div className="w-full h-[387px] rounded-t bg-red-500">1</div>
            <div className=" w-full h-[387px] rounded-t  bg-blue-500">2</div>
            <div className="w-full h-[387px] rounded-t bg-pink-500">3</div>
            <div className="w-full h-[387px] rounded-t bg-yellow-500">4</div>
            <div className="w-full h-[387px] rounded-t bg-red-500">5</div>
          </MediaCarousel>
          <Link
            href="/"
            classNames="absolute h-[108px] bottom-[133px] right-0 z-30 relative flex flex-row-reverse pr-[15px]"
          >
            <svg
              width="108"
              height="108"
              viewBox="0 0 108 108"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 right-0"
            >
              <g filter="url(#filter0_d_173_27597)">
                <rect
                  x="4"
                  width="100"
                  height="100"
                  rx="50"
                  fill="url(#paint0_linear_173_27597)"
                  shapeRendering="crispEdges"
                />
                <rect
                  x="4.5"
                  y="0.5"
                  width="99"
                  height="99"
                  rx="49.5"
                  stroke="url(#paint1_linear_173_27597)"
                  shapeRendering="crispEdges"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_173_27597"
                  x="0"
                  y="0"
                  width="108"
                  height="108"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_173_27597"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_173_27597"
                    result="shape"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_173_27597"
                  x1="4"
                  y1="0"
                  x2="123.272"
                  y2="35.8108"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#303030" />
                  <stop offset="0.489583" stopColor="#4B4B4B" />
                  <stop offset="1" stopColor="#373737" stopOpacity="0.957447" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_173_27597"
                  x1="104"
                  y1="-200.153"
                  x2="3.20949"
                  y2="-200.153"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.0510899" />
                  <stop offset="0.490278" stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-center mt-7 w-fit z-20">
              <Icon
                icon="ticket"
                classNames="rotate-[-15deg]"
                width={24.46}
                height={17.47}
              />
              <div className="text-white font-button text-[14px] leading-6 font-semibold">
                Buy Tickets
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
