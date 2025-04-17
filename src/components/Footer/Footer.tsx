import React from 'react'
import oudhLogo from '../../assets/oudh-logo-colors-img.png'

export default function Footer() {
    return (
        <footer className='w-full h-1/12 flex items-center justify-center bg-cadet-blue text-arsenic font-medium border-t border-gray-800'>
          <img src={oudhLogo} alt="" className='h-16 mr-2' />
          <span>© DEI-OUDH UCA 2025</span>
        </footer>
      )
}
