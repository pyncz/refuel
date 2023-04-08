import plugin from 'tailwindcss/plugin'
import headlessUiPlugin from '@headlessui/tailwindcss'
import addHeaders from './tailwind/headers'
import addLayouts from './tailwind/layouts'
import addUtils from './tailwind/utils'

const c = (color, opacityValue) => {
  return opacityValue === undefined
    ? `rgb(var(${color}))`
    : `rgba(var(${color}), ${opacityValue})`
}

// return color with concomitant opacity
const co = (color) => {
  return ({ opacityValue }) => c(color, opacityValue)
}

// fill values for enumerable props
const fill = (
  volume,
  valueGetter,
  keyGetter = (i) => `${i + 1}`,
) => {
  const config = {}
  for (let i = 0; i < volume; i++) {
    config[keyGetter(i, volume)] = valueGetter(i, volume)
  }
  return config
}

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
  safelist: [
    'light-mode',
    'dark-mode',
  ],
  content: [
    './**/*.vue',
    './**/*.scss',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
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
    },
    fontFamily: {
      header: ['Manrope', ...sansSerif],
      sans: ['"Open Sans"', ...sansSerif],
      mono: ['monospace'],
    },
    lineHeight: {
      1: 1,
      xs: 1.1,
      sm: 1.15,
      md: 1.5,
      inherit: 'inherit',
    },
    // skins
    textColor: (theme) => ({
      ...theme('colors'),
      base: co('--color-base'),
      dim: fill(3, (i) => co(`--color-dim-${i + 1}`)),
    }),
    backgroundColor: (theme) => ({
      ...theme('colors'),
      base: co('--bg-base'),
      dim: fill(3, (i) => co(`--bg-dim-${i + 1}`)),
    }),
    borderColor: (theme) => ({
      ...theme('colors'),
      base: co('--border-base'),
      dim: fill(3, (i) => co(`--border-dim-${i + 1}`)),
      transparent: 'transparent',
    }),
    borderRadius: {
      0: '0',
      sm: '0.25rem',
      DEFAULT: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      full: '9999px',
    },
    scale: {
      click: '0.975',
      normal: '1',
    },
    fill: (theme) => theme('textColor'),
    stroke: (theme) => theme('borderColor'),
    opacity: {
      0: '0',
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
    },
  },
  plugins: [
    plugin(addHeaders),
    plugin(addLayouts),
    plugin(addUtils),
    headlessUiPlugin,
  ],
}
