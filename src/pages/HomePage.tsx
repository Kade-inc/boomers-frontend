import React from 'react'
import image from '../assets/Wireframe - 1.png'
import mobileImage from '../assets/Android Large - 1.png'
import tabletPotrait from '../assets/iPad Pro 11_ - 1.png';

const HomePage = () => {
  return (
    <div className="bg-black min-h-screen">
        <img src={image} alt="image" className="hidden md:hidden xl:block w-full h-100 object-cover"/>
        <img src={mobileImage} alt="image" className="sm:block md:hidden lg:hidden hw-full h-100 object-cover"/> 
       {/* <img src={tabletPotrait} alt="image" className="sm:hidden xs:hidden md:block xl:hidden hw-full h-100 object-cover"/> */}
    </div>
  )
}

export default HomePage