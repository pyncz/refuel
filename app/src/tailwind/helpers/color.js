/**
 * Return color with concomitant opacity
 */
export const c = (color, opacityValue) => {
  return opacityValue === undefined
    ? `rgb(var(${color}))`
    : `rgba(var(${color}), ${opacityValue})`
}

/**
 * Return getter of color by the concomitant opacity
 */
export const co = (color) => {
  return ({ opacityValue }) => c(color, opacityValue)
}
