/* eslint-disable react/react-in-jsx-scope */
import image from "../assets/Wireframe - 1.png";
import mobileImage from "../assets/Android Large - 1.png";
// import tabletPotrait from "../assets/iPad Pro 11_ - 1.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/");
      setIsLoading(false);
      return;
    }
    const decodedToken = jwtDecode(token || "");
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      navigate("/");
      setIsLoading(false);
    } else {
      navigate("/dashboard");
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {isLoading && (
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}
      <div className="relative flex justify-center">
        <img
          src={image}
          alt="image"
          className="hidden md:hidden xl:block w-screen h-screen object-cover"
        />
        <img
          src={mobileImage}
          alt="image"
          className="sm:block md:hidden lg:hidden hw-full w-screen h-screen object-cover"
        />
        {/* <img src={tabletPotrait} alt="image" className="sm:none xs:hidden md:block xl:hidden hw-full w-screen h-screen object-cover"/> */}
        <div className="flex absolute items-center justify-between w-full px-7">
          <p className="font-heading text-[30px] font-extrabold text-white mt-5">
            LOGO
          </p>
          <div className="">
            <Link to={"/auth/login"}>
              <button className="btn bg-yellow  text-darkgrey border-none text-[16px] font-body font-medium px-10 rounded py-0 hover:bg-yellow mt-5 ">
                Sign In
              </button>
            </Link>
          </div>
        </div>
        <p className="hidden md:block absolute md:top-[300px] text-white lg:top-[250px] w-[700px] font-body text-[70px] font-black text-center leading-[5rem]">
          The platform you need to level up your skills.
        </p>
        <p className="sm:block md:hidden absolute text-white top-[25%] font-body text-[50px] w-[90%] font-black text-center leading-[4rem]">
          The platform you need to level up your skills.
        </p>
        <p className="hidden md:block absolute md:top-[600px] md:w-[600px] lg:w-full lg:top-[550px] text-center font-body text-[20px] text-white">
          Connect with experienced professionals and challenge yourself with
          exciting tasks.
        </p>
        <p className="sm:block md:hidden absolute top-[66%] text-center font-body text-[16px] text-white px-10">
          Connect with experienced professionals and challenge yourself with
          exciting tasks.
        </p>
        <div className="absolute top-[640px] md:top-[700px] lg:top-[600px] ">
          <Link to={"/auth"}>
            <button className="btn bg-yellow text-darkgrey border-none text-[20px] font-body font-medium px-20 rounded mt-5 hover:bg-yellow">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
