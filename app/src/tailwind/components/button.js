import { c } from '../helpers'
import { getUiElement } from './base'

export const addButton = ({ addComponents, addUtilities, theme }) => {
  const uiElement = getUiElement(theme)

  const disabledStyles = {
    opacity: theme('opacity.muted'),
    pointerEvents: 'none',
  }

  addComponents({
    '.button': {
      // defaults
      '--tw-text-opacity': '1',
      '--tw-bg-opacity': '1',

      ...uiElement,

      'cursor': 'pointer',
      'gap': theme('gap.1'),
      'display': 'inline-flex',
      'justifyContent': 'center',
      'alignItems': 'center',
      'color': c('--button-text', 'var(--tw-text-opacity)'),
      'backgroundColor': c('--button-bg', 'var(--tw-bg-opacity)'),
      'fontWeight': theme('fontWeight.medium'),

      '&:disabled': disabledStyles,
      '&[data-disabled]': disabledStyles,

      '&:hover': {
        ...uiElement['&:hover'],
        color: c('--button-text--hover', 'var(--tw-text-opacity)'),
        backgroundColor: c('--button-bg--hover', 'var(--tw-bg-opacity)'),
      },
      '&:active': {
        transform: `scale(${theme('scale.click')})`,
      },
    },
  })
  addUtilities({
    '.button-primary': {
      '--button-text': 'var(--button-primary-color)',
      '--button-text--hover': 'var(--button-primary-color-vivid)',
      '--button-bg': 'var(--button-primary-bg)',
      '--button-bg--hover': 'var(--button-primary-bg-vivid)',
    },
    '.button-secondary': {
      '--button-text': 'var(--button-secondary-color)',
      '--button-text--hover': 'var(--button-secondary-color-vivid)',
      '--button-bg': 'var(--button-secondary-bg)',
      '--button-bg--hover': 'var(--button-secondary-bg-vivid)',
    },
  })
  addComponents({
    '.button-icon': {
      padding: 'var(--ui-px)',
      height: 'var(--ui-size)',
      width: 'var(--ui-size)',
    },
  })
}
