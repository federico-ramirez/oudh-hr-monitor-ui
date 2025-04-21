import ucaLogo from '../../assets/Logo_UCA_2015.png'

export default function Nav() {
    return (
        <nav className='w-full border-b bg-cadet-blue border-gray-800 flex items-center justify-start py-2'>
            <img src={ucaLogo} alt="" className='h-16 ml-8 lg:ml-16' />
        </nav>
    )
}
