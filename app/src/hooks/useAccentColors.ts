import type { Color } from 'chroma-js'
import chroma from 'chroma-js'
import { useEffect } from 'react'

const accentsPalette = [
  '#e90ef1',
  '#9e0ef1',
  '#520ef1',
  '#0e87f1',
  '#13b4e1',
]

const toVar = (color: Color | string) => chroma(color).rgb().join(', ')

const accentsSymmetricPalette = accentsPalette.concat(
  ...accentsPalette.slice(0, -1).reverse(),
)
const accentsScale = chroma
  .scale(accentsSymmetricPalette)
  .mode('lab')
  .colors(100)
  .slice(0, -1) // remove the last color as it's the same as the 1st one

// Handler
let accentIndex = 0
const updateAccentColor = () => {
  const accent = accentsScale[accentIndex]!
  accentIndex = (accentIndex + 1) % accentsScale.length

  const root = document.getElementsByTagName('html')[0]!
  root.style.setProperty('--accent-primary', toVar(accent))
  root.style.setProperty('--accent-primary-lighten', toVar(chroma(accent).brighten(0.5)))
  root.style.setProperty('--accent-primary-darken', toVar(chroma(accent).darken(0.5)))
}

export const useAccentColors = () => {
  useEffect(() => {
    updateAccentColor()
    const timer = setInterval(updateAccentColor, 1000)

    return () => clearInterval(timer)
  }, [])
}
