import { c } from '../helpers'

export const addLink = ({ addComponents, addUtilities, theme }) => {
  const disabledStyles = {
    opacity: theme('opacity.muted'),
  }

  addComponents({
    '.link': {
      // defaults
      '--link-text': 'var(--color-dim-2)',
      '--link-text--hover': 'var(--link-primary-vivid)',
      '--link-border': 'var(--border-dim-1)',
      '--link-border--hover': 'var(--link-primary-vivid)',
      '--tw-text-opacity': '1',
      '--tw-border-opacity': '1',

      'display': 'inline-block',
      'cursor': 'pointer',
      'color': c('--link-text', 'var(--tw-text-opacity)'),
      'border-bottom': `${theme('borderWidth.DEFAULT')} solid ${c('--link-border', 'var(--tw-border-opacity)')}`,
      'transitionDuration': theme('transitionDuration.normal'),

      '&:disabled': disabledStyles,
      '&[data-disabled]': disabledStyles,

      '&:hover': {
        color: c('--link-text--hover', 'var(--tw-text-opacity)'),
        borderColor: c('--link-border--hover', 'var(--tw-border-opacity)'),
        transitionDuration: theme('transitionDuration.fast'),
      },
    },
  })
  addUtilities({
    '.link-primary': {
      '--link-text': 'var(--link-primary)',
      '--link-text--hover': 'var(--link-primary-vivid)',
      '--link-border': 'var(--link-primary)',
      '--link-border--hover': 'var(--link-primary-vivid)',
    },
    '.link-regular': {
      '--link-text': 'var(--color-dim-2)',
      '--link-text--hover': 'var(--link-primary-vivid)',
      '--link-border': 'var(--border-dim-1)',
      '--link-border--hover': 'var(--link-primary-vivid)',
    },
    '.link-muted': {
      '--link-text': 'var(--color-dim-3)',
      '--link-text--hover': 'var(--color-dim-2)',
      '--link-border': 'var(--border-dim-1)',
      '--link-border--hover': 'var(--border-base)',
    },
  })
}
