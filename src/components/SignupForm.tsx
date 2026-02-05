import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import useSignup from "../hooks/useSignup";
import { Toaster } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useSignUpStore from "../stores/signUpStore";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import craftHyveLogoSelf from "../assets/crafthyve-logo-self.svg";

const schema = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /[A-Za-z]/,
        "Password must contain at least one alphabet (uppercase or lowercase)",
      )
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[-.@$!%+=<>,#?&]/,
        "Password must contain at least one special character (-,.,@,$,!,%,+,=,<,>,#,?,&)",
      ),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

type FormData = z.infer<typeof schema>;

const SignupForm = () => {
  const navigate = useNavigate();
  const mutation = useSignup();
  const setSignUpSuccess = useSignUpStore((s) => s.setSignUpSuccess);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tId = queryParams.get("tId");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const { confirmpassword, ...userData } = data; // eslint-disable-line @typescript-eslint/no-unused-vars

    let payload = {};

    if (tId) {
      payload = {
        ...userData,
        teamId: tId,
      };
    } else {
      payload = userData;
    }

    await mutation.mutateAsync(payload);
    setSignUpSuccess(true);
    navigate("/auth/signup-success");
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="text-darkgrey">
      <form
        className="w-full px-4 pb-[2%] pt-8 md:px-24"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="block md:hidden font-heading text-[30px] flex justify-center">
          <Link to="/">
            <img
              src={craftHyveLogoSelf}
              alt="CraftyHyve Logo"
              className="w-12"
            />
          </Link>
        </h2>
        <p className="font-extrabold text-[50px] font-heading">SIGN UP</p>
        <p className="py-[2.6%] text-[18px] font-semibold font-body">
          Create an account to begin your journey.
        </p>
        <Toaster
          position="bottom-center"
          reverseOrder={true}
          toastOptions={{
            error: {
              style: {
                background: "#D92D2D",
                color: "white",
              },
              iconTheme: {
                primary: "white",
                secondary: "#D92D2D",
              },
            },
          }}
        />
        <div className="mb-[3%]">
          <label
            className="block text-base font-bold mb-[1%] font-body"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none focus:border-gray-700"
            style={{ backgroundColor: "transparent" }}
            {...register("email")}
            id="email"
          />
          {errors.email && (
            <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
              {errors.email?.message}
            </p>
          )}
        </div>

        <div className="mb-[3%]">
          <label
            className="block text-base font-bold mb-[1%] font-body"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 focus:outline-none focus:border-gray-700"
            style={{ backgroundColor: "transparent" }}
            {...register("username")}
          />
          {errors.username && (
            <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-[3%]">
          <label
            className="block text-base font-bold mb-[1%] font-body"
            htmlFor="password"
          >
            Password
          </label>
          <div className="flex justify-end items-center relative">
            {showPassword ? (
              <EyeSlashIcon
                className="absolute inset-y-0 right-3 flex items-center pl-2 w-8 h-8 top-2.5 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <EyeIcon
                className="absolute inset-y-0 right-3 flex items-center pl-2 w-8 h-8 top-2.5 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            )}
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="on"
              id="password"
              placeholder="Create a password"
              className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 focus:outline-none focus:border-gray-700"
              style={{ backgroundColor: "transparent" }}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-[3%]">
          <label
            className="block text-base font-bold mb-[1%] font-body"
            htmlFor="confirmpassword"
          >
            Confirm password
          </label>
          <div className="flex justify-end items-center relative">
            {showConfirmPassword ? (
              <EyeSlashIcon
                className="absolute inset-y-0 right-3 flex items-center pl-2 w-8 h-8 top-2.5 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              />
            ) : (
              <EyeIcon
                className="absolute inset-y-0 right-3 flex items-center pl-2 w-8 h-8 top-2.5 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              />
            )}
            <input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="on"
              id="confirmpassword"
              placeholder="Confirm your password"
              className="input w-full border border-gray-700  rounded-md font-body placeholder-gray-600 focus:outline-none focus:border-gray-700"
              style={{ backgroundColor: "transparent" }}
              {...register("confirmpassword")}
            />
          </div>
          {errors.confirmpassword && (
            <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
              {errors.confirmpassword.message}
            </p>
          )}
        </div>

        <button
          className="btn w-full bg-darkgrey mb-[3%] text-white border-none text-[17px] font-body hover:bg-black disabled:opacity-100"
          type="submit"
        >
          {mutation.isPending ? (
            <span className="loading loading-dots loading-md"></span>
          ) : (
            <span>Sign Up</span>
          )}
        </button>

        {/* <div className="flex items-center gap-5 justify-center text-center mb-[3%]">
          <div className="border-t-2 border-darkgrey my-4 flex-grow w-200"></div>

          <p className="font-semibold font-body">Or sign up with</p>
          <div className="border-t-2 border-darkgrey my-4 flex-grow w-200"></div>
        </div> */}
        {/* 
        <button
          className="btn bg-white w-full text-[#393E46] text-[17px] border-none mb-[3%] font-body"
          type="button"
        >
          <FcGoogle style={{ fontSize: "1.5em" }} /> Google
        </button> */}

        <p className="text-center font-regular text-darkgrey font-body">
          Already have an account?{" "}
          <Link to="/auth/login">
            <span className="font-bold">Sign in</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
