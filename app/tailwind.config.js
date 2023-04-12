import plugin from 'tailwindcss/plugin'
import maskImagePlugin from '@pyncz/tailwind-mask-image'
import { addButton, addFlexUtils, addHeaders, addInput, addLink, addPopup, addSizeUtils } from './src/tailwind'
import { co, fill } from './src/tailwind/helpers'

const sansSerif = [
  'ui-sans-serif',
  'system-ui',
  '-apple-system',
  'sans-serif',
]

// Read more about tailwindcss configuration: https://tailwindcss.com/docs/configuration
export default {
  mode: 'jit',
  prefix: 'tw-',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    data: {
      highlighted: 'highlighted',
      disabled: 'disabled',
      placeholder: 'placeholder',
    },

    fontSize: {
      'xs': '0.75rem',
      'sm': '0.875rem',
      'normal': '1rem',
      'lg': '1.5rem',
      'xl': '2rem',
      '2xl': '3rem',
      '3xl': '4rem',

      '3/4': '0.75em',
      '7/8': '0.875em',
      'em': '1em',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        md: '2rem',
        lg: '2.5rem',
      },
    },
    colors: {
      black: co('--black'),
      white: co('--white'),
      accent: {
        primary: co('--accent-primary'),
        secondary: co('--accent-secondary'),
      },
      state: {
        error: co('--state-error'),
      },
      current: 'currentcolor',
    },

    fontFamily: {
      header: ['var(--font-manrope)', 'Manrope', ...sansSerif],
      sans: ['var(--font-opensans)', '"Open Sans"', ...sansSerif],
      mono: ['var(--font-dm-mono)', '"DM Mono"', 'monospace'],
    },
    lineHeight: {
      1: 1,
      xs: 1.1,
      sm: 1.15,
      md: 1.5,
      inherit: 'inherit',
    },
    // skins
    textColor: theme => ({
      ...theme('colors'),
      base: co('--color-base'),
      dim: fill(3, i => co(`--color-dim-${i + 1}`)),
    }),
    backgroundColor: theme => ({
      ...theme('colors'),
      base: co('--bg-base'),
      dim: fill(3, i => co(`--bg-dim-${i + 1}`)),
    }),
    borderColor: theme => ({
      ...theme('colors'),
      base: co('--border-base'),
      dim: fill(3, i => co(`--border-dim-${i + 1}`)),
      transparent: 'transparent',
    }),
    borderRadius: {
      0: '0',
      sm: '0.5rem',
      DEFAULT: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
      full: '9999px',
    },
    scale: {
      click: '0.975',
      normal: '1',
    },
    fill: theme => theme('textColor'),
    stroke: theme => theme('borderColor'),
    opacity: {
      0: '0',
      20: '0.2',
      muted: '0.5',
      soft: '0.8',
      full: '1',
    },
    transitionDuration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    zIndex: {
      muted: '-1',
      1: '1',
    },

    extend: {
      screens: {
        '2xs': '320px',
        'xs': '400px',
      },
      spacing: {
        em: '1em',
      },
      height: {
        ui: 'var(--ui-size)',
      },
    },
  },
  plugins: [
    maskImagePlugin,

    plugin(addHeaders),
    plugin(addFlexUtils),
    plugin(addSizeUtils),

    // Components
    plugin(addButton),
    plugin(addInput),
    plugin(addPopup),
    plugin(addLink),

    ({ addVariant }) => {
      addVariant('checked', '&[data-state="checked"]')
      addVariant('child', '& > *')
    },

    ({ addComponents }) => {
      addComponents({
        '.px-ui': {
          paddingLeft: 'var(--ui-px)',
          paddingRight: 'var(--ui-px)',
        },
        '.py-ui': {
          paddingTop: 'var(--ui-py)',
          paddingBottom: 'var(--ui-py)',
        },
      })
    },
  ],
}
