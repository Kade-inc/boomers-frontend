import image from "../assets/khamkeo-vilaysing-rpVQJbZMw8o-unsplash (1) 1.png";

const Signup = () => {
  return (
    <div className="flex h-screen">
      <div className="w-[28.89%] relative">
        <img src={image} alt="image" className="w-full h-full object-cover" />
        <div className="absolute top-[4%] left-[5%] p-4 text-white font-normal text-[40px]">
          <h1>LOGO</h1>
        </div>
        <div className="border-8 rounded-[15px] absolute top-[28.6%] left-1/2 p-4 font-normal transform -translate-x-1/2 text-center text-[60px] w-[87%]">
          WELCOME BOOMER!
        </div>
      </div>
      <div className="w-[71.11%] bg-[#F8B500] rounded-tl-lg rounded-bl-lg">
        <h1>form</h1>
      </div>
    </div>
  );
};

export default Signup;
