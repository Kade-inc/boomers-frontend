import image from '../assets/Wireframe - 1.png'
import mobileImage from '../assets/Android Large - 1.png'
import tabletPotrait from '../assets/iPad Pro 11_ - 1.png';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-black min-h-screen">
      <div className="relative flex justify-center">
        <img src={image} alt="image" className="hidden md:hidden xl:block w-screen h-screen object-cover"/>
        <img src={mobileImage} alt="image" className="sm:block md:hidden lg:hidden hw-full w-screen h-screen object-cover"/> 
       {/* <img src={tabletPotrait} alt="image" className="sm:none xs:hidden md:block xl:hidden hw-full w-screen h-screen object-cover"/> */}
       <div className='flex absolute items-center justify-between w-full px-7'>
        <p className='font-heading text-[30px] font-extrabold text-white mt-5'>LOGO</p>
        <div className=''><Link to={"/auth/login"}>
        <button className="btn bg-yellow  text-darkgrey border-none text-[16px] font-body font-medium px-10 rounded py-0 hover:bg-yellow mt-5 ">Sign In</button></Link></div>
       </div>
       <p className="hidden md:block absolute md:top-[300px] text-white lg:top-[250px] w-[700px] font-body text-[70px] font-black text-center leading-[5rem]">The platform you need to level up your skills.</p>
       <p className="sm:block md:hidden absolute text-white top-[25%] font-body text-[50px] w-[90%] font-black text-center leading-[4rem]">The platform you need to level up your skills.</p>
       <p className="hidden md:block absolute md:top-[600px] md:w-[600px] lg:w-full lg:top-[550px] text-center font-body text-[20px] text-white">Connect with experienced professionals and challenge yourself with exciting tasks.</p>
       <p className="sm:block md:hidden absolute top-[66%] text-center font-body text-[16px] text-white px-10">Connect with experienced professionals and challenge yourself with exciting tasks.</p>
       <div className="absolute top-[640px] md:top-[700px] lg:top-[600px] "><Link to={"/auth"}>
       <button  className="btn bg-yellow text-darkgrey border-none text-[20px] font-body font-medium px-20 rounded mt-5 hover:bg-yellow">Get Started</button>
       </Link>
       </div>
    
       </div>
    </div>
  )
}

export default HomePage