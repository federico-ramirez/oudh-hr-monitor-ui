import React from 'react'
import ucaLogo from '../../assets/Logo_UCA_2015.png'

export default function Nav() {
    return (
        <nav className='w-full h-1/12 border-b bg-cadet-blue border-gray-800 flex items-center justify-start'>
            <img src={ucaLogo} alt="" className='h-16 ml-8 lg:ml-16' />
        </nav>
    )
}
