import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import ResetPasswordSuccess from "../components/ResetPasswordSuccess";

const schema = z
  .object({
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

const ResetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password");
  const confirmpassword = watch("confirmpassword");

  const isFormValid =
    password && confirmpassword && password === confirmpassword;

  const onSubmit = (data: FormData) => {
    console.log("Password Reset Success", data);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return <ResetPasswordSuccess />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white">
      <h2 className="block font-heading text-[30px] leading-[31.86px] p-0 lg:p-6 lg:text-[50px] lg:leading-[53.1px]">
        <Link to="/">LOGO</Link>
      </h2>
      <div className="w-full max-w-sm py-2 lg:py-6 p-5 lg:p-0">
        <h2 className="text-center text-[18px] leading-[21.94px] py-2 lg:py-4 font-body font-bold lg:text-[25px] lg:leading-[30.48px]">
          Reset your Password
        </h2>
        <form
          className="w-full py-[8%] lg:py-[10%] justify-center items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
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
          <div className="w-full mb-[9%]">
            <label
              className="block text-darkgrey text-[14px] leading-[17.07px] font-medium  mb-[3%] font-body lg:text-[20px] lg:leading-[24.38px]"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              type="password"
              autoComplete="on"
              id="password"
              {...register("password")}
              placeholder="Enter password"
              className="input w-full border border-darkgrey bg-transparent rounded-md font-body placeholder-lightgrey text-[12px] hover:border-gray-700 focus:outline-none lg:text-[15px]"
              style={{ backgroundColor: "transparent" }}
            />
            {errors.password && (
              <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                {errors.password?.message}
              </p>
            )}
          </div>

          <div className="mb-[9%]">
            <label
              className="block text-darkgrey text-[14px] leading-[17.07px] font-medium mb-[3%] font-body lg:text-[20px] lg:leading-[24.38px]"
              htmlFor="confirmpassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              autoComplete="on"
              id="confirmpassword"
              placeholder="Confirm password"
              {...register("confirmpassword")}
              className="input w-full border border-darkgrey bg-transparent rounded-md font-body placeholder-lightgrey text-[12px] hover:border-gray-700 focus:outline-none lg:text-[15px]"
            />
            {errors.confirmpassword && (
              <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                {errors.confirmpassword?.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full rounded-md lg:mt-6 py-3 text-[14px] leading-[17.07px] font-medium text-darkgrey bg-yellow transition-opacity duration-200 lg:text-[20px] lg:leading-[24.38px]
            ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!isFormValid}
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
