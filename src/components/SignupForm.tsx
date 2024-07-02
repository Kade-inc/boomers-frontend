import { FcGoogle } from "react-icons/fc";

const SignupForm = () => {
  return (
    <div className="text-[#393E46]">
      <form className="w-full px-24 py-[2%]">
        <p className="font-extrabold text-[50px] leading-[53px]">SIGN UP</p>
        <p className="py-[2.6%] text-[25px] font-semibold">
          Create an account to begin your journey
        </p>
        <div className="mb-[3%]">
          <label className="block text-base font-bold mb-[1%]" htmlFor="name">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            className="input w-full border border-gray-700 bg-transparent rounded-md"
            style={{ backgroundColor: "transparent" }}
          />
        </div>
        <div className="mb-[3%]">
          <label className="block text-base font-bold mb-[1%]" htmlFor="name">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            className="input w-full border border-gray-700 bg-transparent rounded-md"
            style={{ backgroundColor: "transparent" }}
          />
        </div>
        <div className="mb-[3%]">
          <label className="block text-base font-bold mb-[1%]" htmlFor="name">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            className="input w-full border border-gray-700 bg-transparent rounded-md"
            style={{ backgroundColor: "transparent" }}
          />
        </div>
        <div className="mb-[3%]">
          <label className="block text-base font-bold mb-[1%]" htmlFor="name">
            Confirm password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="input w-full border border-gray-700  rounded-md"
            style={{ backgroundColor: "transparent" }}
          />
        </div>

        <button className="btn w-full bg-[#393E46] text-[20px] mb-[3%]">
          Sign Up
        </button>

        <div className="flex gap-5 justify-center text-center mb-[3%]">
          <div
            className="border-t-2 border-black my-4 flex-grow "
            style={{ width: "400px" }}
          ></div>

          <p className="text-[20px] font-semibold">Or sign up with</p>
          <div
            className="border-t-2 border-black my-4 flex-grow"
            style={{ width: "400px" }}
          ></div>
        </div>

        <button className="btn bg-white w-full text-[#393E46] border-none text-[20px] mb-[3%]">
          <FcGoogle style={{ fontSize: "1.5em" }} /> Google
        </button>

        <p className="text-center text-[20px] font-semibold text-black">
          Already have an account? <span className="font-bold">Sign in</span>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
