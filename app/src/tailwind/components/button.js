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
      '--tw-bg-opacity': '1',
      '--tw-text-opacity': '1',

      ...uiElement,
      '--x-button-bg': 'var(--button-bg)',
      '--x-button-text': 'var(--button-text)',
      '--ui-ring': 'var(--x-button-bg)',

      'cursor': 'pointer',
      'gap': theme('gap.1'),
      'display': 'inline-flex',
      'justifyContent': 'center',
      'alignItems': 'center',
      'backgroundColor': c('--x-button-bg', 'var(--tw-bg-opacity)'),
      'color': c('--x-button-text', 'var(--tw-text-opacity)'),
      'fontWeight': theme('fontWeight.medium'),

      '&:disabled': disabledStyles,
      '&[data-disabled]': disabledStyles,

      '&:hover': {
        ...uiElement['&:hover'],
        '--x-button-bg': 'var(--button-bg--hover)',
        '--x-button-text': 'var(--button-text--hover)',
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
