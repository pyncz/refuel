export const getUiElement = (theme) => {
  const focusStyles = {
    '--tw-ring-opacity': 'var(--o-ring)',
  }

  return {
    'height': '2rem',
    'padding': '0.25rem 0.75rem',

    'outline': 'none !important',
    'lineHeight': '1',
    'borderRadius': theme('borderRadius.DEFAULT'),
    'transitionDuration': theme('transitionDuration.normal'),
    '&:hover': {
      transitionDuration: theme('transitionDuration.fast'),
    },

    // ring
    '--tw-ring-opacity': '0',
    '--tw-ring-color': 'rgba(var(--accent-primary), var(--tw-ring-opacity))',
    '--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
    '--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
    'boxShadow': 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
    '&:focus': focusStyles,
    '&:focus-within': focusStyles,
  }
}
