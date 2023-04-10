import { c } from '../helpers'
import { getUiElement } from './base'

export const addInput = ({ addComponents, theme }) => {
  const uiElement = getUiElement(theme)

  const disabledStyles = {
    'color': c('--input-disabled-text', 'var(--tw-text-opacity)'),
    'backgroundColor': c('--input-disabled-bg', 'var(--tw-bg-opacity)'),
    'borderColor': c('--input-disabled-border', 'var(--tw-border-opacity)'),
    '&::placeholder, &[data-placeholder]': {
      color: c('--input-disabled-placeholder', 'var(--tw-text-opacity)'),
    },
  }
  const placeholderStyles = {
    color: c('--input-placeholder', 'var(--tw-text-opacity)'),
  }
  const focusStyles = {
    borderColor: c('--input-border--focus', 'var(--tw-border-opacity)'),
  }

  addComponents({
    '.input': {
      // defaults
      '--tw-text-opacity': '1',
      '--tw-bg-opacity': '1',
      '--tw-border-opacity': '1',

      ...uiElement,

      'display': 'inline-flex',
      'alignItems': 'center',
      'color': c('--input-text', 'var(--tw-text-opacity)'),
      'backgroundColor': c('--input-bg', 'var(--tw-bg-opacity)'),
      'border': `${theme('borderWidth.DEFAULT')} solid ${c('--input-border', 'var(--tw-border-opacity)')}`,
      'fontSize': '0.875rem',

      '&:not(button):read-only': {
        color: c('--input-readonly-text', 'var(--tw-text-opacity)'),
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
        borderColor: c('--input-border--hover', 'var(--tw-border-opacity)'),
      },

      '&:focus': {
        ...uiElement['&:focus'],
        ...focusStyles,
      },
      '&:focus-within': {
        ...uiElement['&:focus-within'],
        ...focusStyles,
      },
    },
  })
}
