import { c } from '../helpers'
import { getUiElement } from './base'

export const addInput = ({ addComponents, theme }) => {
  const uiElement = getUiElement(theme)

  const disabledStyles = {
    '--x-input-bg': 'var(--input-disabled-bg)',
    '--x-input-text': 'var(--input-disabled-text)',
    '--x-input-border': 'var(--input-disabled-border)',

    '&::placeholder, &[data-placeholder]': {
      color: c('--input-disabled-placeholder', 'var(--tw-text-opacity)'),
    },
  }
  const placeholderStyles = {
    color: c('--input-placeholder', 'var(--tw-text-opacity)'),
  }

  addComponents({
    '.input': {
      // defaults
      '--tw-bg-opacity': '1',
      '--tw-text-opacity': '1',
      '--tw-border-opacity': '1',

      ...uiElement,
      '--x-input-bg': 'var(--input-bg)',
      '--x-input-text': 'var(--input-text)',
      '--x-input-border': 'var(--input-border)',
      '--ui-ring': 'var(--x-input-border)',

      'display': 'inline-flex',
      'alignItems': 'center',
      'color': c('--x-input-text', 'var(--tw-text-opacity)'),
      'backgroundColor': c('--x-input-bg', 'var(--tw-bg-opacity)'),
      'border': `${theme('borderWidth.DEFAULT')} solid ${c('--x-input-border', 'var(--tw-border-opacity)')}`,

      '&:not(button):read-only': {
        '--x-input-bg': 'var(--input-readonly-bg)',
        '--x-input-text': 'var(--input-readonly-text)',
      },

      '&::placeholder': {
        ...uiElement['&::placeholder'],
        ...placeholderStyles,
      },
      '&[data-placeholder]': {
        ...uiElement['&[data-placeholder]'],
        ...placeholderStyles,
      },

      '&:disabled': {
        ...uiElement['&:disabled'],
        ...disabledStyles,
      },
      '&[data-disabled]': {
        ...uiElement['&[data-disabled]'],
        ...disabledStyles,
      },

      '&:hover': {
        ...uiElement['&:hover'],
        '--x-input-border': 'var(--input-border--hover)',
      },

      '&:focus, &:focus-within': {
        ...uiElement['&:focus'],
        '--x-input-border': 'var(--input-border--focus)',
        '&:hover': {
          '--x-input-border': 'var(--input-border--focus-hover)',
        },
      },
    },
  })
}
