import { useEffect } from 'react'
import localFont from 'next/font/local'

// Optimize fonts
const Manrope = localFont({
  variable: '--font-manrope',
  style: 'normal',
  src: [
    {
      path: '../assets/fonts/Manrope/Manrope-SemiBold.ttf',
      weight: '600',
    },
    {
      path: '../assets/fonts/Manrope/Manrope-Bold.ttf',
      weight: '700',
    },
    {
      path: '../assets/fonts/Manrope/Manrope-ExtraBold.ttf',
      weight: '800',
    },
  ],
})
const OpenSans = localFont({
  variable: '--font-opensans',
  style: 'normal',
  src: [
    {
      path: '../assets/fonts/OpenSans/OpenSans-Light.ttf',
      weight: '300',
    },
    {
      path: '../assets/fonts/OpenSans/OpenSans-Regular.ttf',
      weight: '400',
    },
  ],
})
const DMMono = localFont({
  variable: '--font-dm-mono',
  src: '../assets/fonts/DM_Mono/DMMono-Regular.ttf',
  weight: '400',
})

const fonts = [Manrope, OpenSans, DMMono]

export const useFonts = () => {
  useEffect(() => {
    const root = document.getElementsByTagName('html')[0]!
    root.classList.add(...fonts.map(font => font.variable))
  }, [])
}
