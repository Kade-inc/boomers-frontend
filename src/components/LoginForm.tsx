/* eslint-disable react/no-unescaped-entities */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useSignin from "../hooks/useSignin";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const schema = z.object({
  accountId: z.string().min(1),
  password: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const mutation = useSignin();

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await mutation.mutateAsync(data);
    navigate("/");
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="text-[#393E46]">
      <form
        className="w-full px-4 py-[2%] md:px-24"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="font-extrabold text-[50px] leading-[53px] font-heading">
          SIGN IN
        </p>
        <p className="py-[2.6%] text-[18px] font-semibold font-body">
          Enter your credentials to sign in
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
            Email/Username
          </label>
          <input
            type="text"
            {...register("accountId")}
            placeholder="Enter email or username"
            className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
            style={{ backgroundColor: "transparent" }}
            id="emailOrUsername"
          />
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
              {...register("password")}
              placeholder="Enter password"
              className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
        </div>

        <button
          className="btn w-full bg-[#393E46] text-[17px] mb-[3%] text-white border-none disabled:text-gray-500 font-body hover:bg-black"
          type="submit"
        >
          Sign In
        </button>

        <div className="flex items-center gap-5 justify-center text-center mb-[3%]">
          <div className="border-t-2 border-darkgrey my-4 flex-grow w-200"></div>

          <p className="font-semibold font-body">Or sign up with</p>
          <div className="border-t-2 border-darkgrey my-4 flex-grow w-200"></div>
        </div>

        <button
          className="btn bg-white w-full text-darkgrey border-none text-[17px] mb-[3%] font-body"
          type="button"
        >
          <FcGoogle style={{ fontSize: "1.5em" }} /> Google
        </button>

        <p className="text-center font-regular text-darkgrey font-body">
          Don't have an account?
          <Link to="/auth">
            <span className="font-bold"> Sign Up</span>
          </Link>
        </p>
        <Link to="/auth/forgot-password">
          <p className="text-center font-regular text-darkgrey font-body font-[600] mt-6">
            Forgot your password
          </p>
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
