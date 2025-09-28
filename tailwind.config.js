const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
        '2xl': '1440px',
      },
      container: {
        padding: '2rem',
      },
      fontFamily: {
        sans: ['var(--font-ibm)', 'var(--font-ping-fang)'],
        body: ['var(--font-ibm)'],
        footer: ['var(--font-ibm)'],
        pingFang: ['var(--font-ping-fang)'],
        rubik: ['var(--font-rubik)'],
        notosanstc: ['var(--font-notosanstc)'],
        zeitung: ['var(--font-zeitung)'],
        countach: ['var(--font-countach)'],
        card: ['var(--font-ibm)'],
        input: ['var(--font-ping-fang)'],
        button: ['var(--font-ping-fang)'],
        'tab-item': ['var(--font-ibm)'],
        'menu-item': ['var(--font-ping-fang)'],
        'list-item': ['var(--font-ping-fang)'],
        primary: ['var(--font-ibm)'],
        secondary: ['var(--font-ping-fang)'],
        tertiary: ['var(--font-rubik)'],
      },
      width: {
        'button-sm': '169px',
        'button-md': '169px',
        'button-lg': '235px',
        'button-base': '488px',
        'button-xl': '488px',
      },
      borderRadius: {
        button: '4px',
        pill: '100px',
        'tab-item': '100px',
        'card-photo-overlay': '0px 0px 4px 4px',
      },
      colors: {
        gray: {
          ...colors.gray,
          200: '#EDEDED',
          250: '#D9D9D9',
          270: '#CECECE',
          300: '#B8B8B8',
          310: '#B6B6B6',
          350: '#ABABAB',
          400: '#A9A9A9',
          700: '#5F5F5F',
          800: '#414141',
          900: '#353535',
          1000: '#393939',
        },
        'white-500': 'rgba(255, 255, 255, 0.5)',
        'white-700': 'rgba(255, 255, 255, 0.7)',
        'white-800': 'rgba(255, 255, 255, 0.8)',
        'black-900': 'rgba(4, 4, 4, 0.8)',
        pill: '#FA4848',
        'primary-button-label': 'white',
        'form-input': 'rgba(81, 81, 81, 0.9)',
      },
      backgroundImage: {
        'linear-background':
          'linear-gradient(180deg, #444444 0%, #181818 100%)',
        'linear-card':
          'linear-gradient(106.71deg, #303030 0%, #4B4B4B 48.96%, rgba(55, 55, 55, 0.957447) 100%)',
        'linear-line':
          'linear-gradient(270deg, rgba(255, 255, 255, 0.0510899) 0%, #FFFFFF 49.42%, rgba(255, 255, 255, 0) 100.79%)',
        // linear background for button
        'primary-button': 'linear-gradient(180deg, #004F36 0%, #004F36 100%)',
        'secondary-button': 'linear-gradient(180deg, #004F36 0%, #004F36 100%)',
        // linear background for menu item
        'menu-item': 'linear-gradient(180deg, #FFFFFF 0%, #C6C6C6 100%)',
        // linear background for step
        'linear-step':
          'linear-gradient(144.87deg, #FFFFFF 20.65%, rgba(255, 255, 240, 0) 115.43%)',
        // linear background for header
        'linear-header': 'linear-gradient(180deg, #444444 0%, #181818 100%)',
        // linear background for media carousel paging
        'linear-active-pagination':
          'linear-gradient(92.66deg, rgb(0,  79, 54) 8.44%, rgb(0,  79, 54) 100.06%)',
        'linear-inactive-pagination':
          'linear-gradient(92.66deg, rgba(255, 255, 255, 0.5) 8.44%, rgba(255, 255, 255, 0.5) 100.06%)',
      },
      // @TODO: define font family
      fontSize: {
        h1: [
          '40px',
          {
            lineHeight: '52px',
            fontWeight: '700',
          },
        ],
        h2: [
          '32px',
          {
            lineHeight: '42px',
            fontWeight: '700',
          },
        ],
        h3: [
          '24px',
          {
            lineHeight: '31px',
            fontWeight: '700',
          },
        ],
        'h3--sm': [
          '20px',
          {
            lineHeight: '26px',
            fontWeight: '700',
          },
        ],
        h4: [
          '20px',
          {
            lineHeight: '26px',
            fontWeight: '700',
          },
        ],
        body2: [
          '16px',
          {
            lineHeight: '20.8px',
            fontWeight: '500',
          },
        ],

        body3: [
          '20px',
          {
            lineHeight: '26px',
            fontWeight: '500',
          },
        ],
        body4: [
          '20px',
          {
            lineHeight: '26px',
            fontWeight: '500',
          },
        ],

        body5: [
          '24px',
          {
            lineHeight: '31.2px',
            fontWeight: 500,
          },
        ],
        'card-title': [
          '24px',
          {
            lineHeight: '31px',
            fontWeight: '700',
          },
        ],
        footer: [
          '14px',
          {
            lineHeight: '18px',
            fontWeight: '400',
          },
        ],
        'tab-item': [
          '24px',
          {
            lineHeight: '31px',
            fontWeight: '400',
          },
        ],
        menu: [
          '16px',
          {
            lineHeight: '16px',
            fontWeight: '400',
          },
        ],
        'menu-item': [
          '14px',
          {
            lineHeight: '18px',
            fontWeight: '600',
          },
        ],
        // @TODO: add font for button
        button: [
          '17px',
          {
            lineHeight: '25px',
            fontWeight: '600',
          },
        ],
        'button-xl': [
          '24px',
          {
            lineHeight: '25px',
            fontWeight: '600',
          },
        ],
        // List Item
        'list-item': [
          '17px',
          {
            lineHeight: '25px',
            fontWeight: '600',
          },
        ],
        'list-item-text': [
          '20px',
          {
            lineHeight: '25px',
            fontWeight: '400',
          },
        ],
        // Input
        'input-label': [
          '20px',
          {
            lineHeight: '25px',
            fontWeight: '400',
          },
        ],
        'input-label--sm': [
          '17px',
          {
            lineHeight: '25px',
            fontWeight: '400',
          },
        ],
        'input-label-error': [
          '17px',
          {
            lineHeight: '25px',
            fontWeight: '400',
          },
        ],
        'input-placeholder': [
          '20px',
          {
            lineHeight: '25px',
            fontWeight: '600',
          },
        ],
        'input-placeholder--sm': [
          '17px',
          {
            lineHeight: '25px',
            fontWeight: '600',
          },
        ],
      },
      boxShadow: {
        'menu-item': '0px 4px 4px rgba(0, 0, 0, 0.25)',
        'tr-item-active': '0px 4px 4px rgba(0, 0, 0, 0.25)',
        'card-item': '0px 4px 4px rgba(0, 0, 0, 0.25)',
      },
      dropShadow: {
        media: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        'score-card': '0px 4px 4px rgba(0, 0, 0, 0.25)',
        'event-inactive': '0px 1px 10px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
