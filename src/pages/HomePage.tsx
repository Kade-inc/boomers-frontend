import React from 'react'
import image from '../assets/Wireframe - 1.png'
import mobileImage from '../assets/Android Large - 1.png'
import tabletPotrait from '../assets/iPad Pro 11_ - 1.png';

const HomePage = () => {
  return (
    <div className="bg-black min-h-screen">
      <div className="relative flex justify-center">
        <img src={image} alt="image" className="hidden md:hidden xl:block w-full h-100 object-cover"/>
        <img src={mobileImage} alt="image" className="sm:block md:hidden lg:hidden hw-full h-100 object-cover"/> 
       {/* <img src={tabletPotrait} alt="image" className="sm:hidden xs:hidden md:block xl:hidden hw-full h-100 object-cover"/> */}
       <div className='flex absolute top-[4%] items-center justify-between w-full px-8'>
        <p className='font-heading text-[30px] font-extrabold text-white'>LOGO</p>
        <button className="btn bg-yellow  text-darkgrey border-none text-[16px] font-body font-medium px-10 rounded py-0">Sign In</button>
       </div>
       <p className="absolute text-white top-[28.6%] w-[700px] font-body text-[70px] font-black text-center leading-[5rem]">The platform you need to level up your skills.</p>
       <p className="absolute top-[58%] text-center font-body text-[20px] text-white">Connect with experienced professionals and challenge yourself with exciting tasks.</p>
       <button  className="absolute top-[65%] btn bg-yellow text-darkgrey border-none text-[20px] font-body font-medium px-20 rounded">Get Started</button>
       </div>
    </div>
  )
}

export default HomePage