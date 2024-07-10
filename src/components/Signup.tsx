import image from "../assets/khamkeo-vilaysing-rpVQJbZMw8o-unsplash (1) 1.png";
import SignupForm from "./SignupForm";

const Signup = () => {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-[35%] relative">
        <img src={image} alt="image" className="w-full h-full object-cover" />
        <div className="absolute top-[4%] left-[5%] p-4 text-white font-normal text-[40px]">
          <h1>LOGO</h1>
        </div>
        <div className="border-8 rounded-[15px] absolute top-[28.6%] left-1/2 p-4 font-normal transform -translate-x-1/2 text-center text-[60px] w-[87%]">
          WELCOME BOOMER!
        </div>
      </div>
      <div className="w-full md:w-[65%] bg-[#F8B500] md:rounded-tl-lg md:rounded-bl-lg">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
