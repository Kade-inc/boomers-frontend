import { Link, Outlet } from "react-router-dom";
import image from "../assets/khamkeo-vilaysing-rpVQJbZMw8o-unsplash (1) 1.png";
import boomer from "../assets/boomer.svg";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-[35%] relative">
        <img src={image} alt="image" className="w-full h-full object-cover" />
        <div className="absolute top-[4%] left-[5%] p-4 text-white font-normal text-[40px]">
          <h1 className="font-heading"> <Link to="/">LOGO</Link></h1>
        </div>
        <div className="absolute top-[28.6%] left-1/2 p-4  -translate-x-1/2 w-[87%]">
          <img src={boomer} alt="image" className="" />
        </div>
      </div>
      <div className="w-full md:w-[65%] bg-yellow">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
