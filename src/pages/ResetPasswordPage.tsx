import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster, toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import ResetPasswordSuccess from "../components/ResetPasswordSuccess";
import useResetPassword from "../hooks/useResetPassword";
import { useState } from "react";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/outline";

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
  const { mutate, isPending, isSuccess } = useResetPassword();
  const [searchParams] = useSearchParams();

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const onSubmit = async (data: FormData) => {
    const token = searchParams.get("token");
    const userId = searchParams.get("id");

    if (token && userId) {
      mutate(
        { userId, password: data.password, token },
        {
          onError: (error: Error) => {
            const isAxiosError = (
              error: Error,
            ): error is AxiosError<{ message: string }> =>
              axios.isAxiosError(error);

            let errorMessage =
              "An unexpected error occurred. Please try again.";

            if (isAxiosError(error) && error.response?.data?.message) {
              errorMessage = error.response.data.message;
            }

            toast.error(`${errorMessage}`);
          },
        },
      );
    }
  };

  if (isSuccess) {
    return <ResetPasswordSuccess />;
  }

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white">
      <h2 className="block font-heading text-[30px] mt-48 md:mt-52 lg:mt-20 lg:text-[50px]">
        <Link to="/">LOGO</Link>
      </h2>
      <div className="w-full max-w-sm py-2 lg:py-6 p-5 lg:p-0">
        <h2 className="text-center text-[18px] py-2 lg:py-4 font-body font-bold lg:text-[25px]">
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
              className="block text-darkgrey text-[14px] font-medium  mb-[3%] font-body lg:text-[20px]"
              htmlFor="password"
            >
              New Password
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
                className="input w-full border border-darkgrey bg-transparent rounded-md font-body placeholder-lightgrey text-[12px] hover:border-gray-700 focus:outline-none lg:text-[15px]"
                style={{ backgroundColor: "transparent" }}
              />
            </div>
            {errors.password && (
              <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                {errors.password?.message}
              </p>
            )}
          </div>

          <div className="mb-[9%]">
            <label
              className="block text-darkgrey text-[14px] font-medium mb-[3%] font-body lg:text-[20px]"
              htmlFor="confirmpassword"
            >
              Confirm Password
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
                placeholder="Confirm password"
                {...register("confirmpassword")}
                className="input w-full border border-darkgrey bg-transparent rounded-md font-body placeholder-lightgrey text-[12px] hover:border-gray-700 focus:outline-none lg:text-[15px]"
              />
            </div>
            {confirmpassword && password !== confirmpassword && (
              <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                Passwords do not match
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full rounded-md lg:mt-6 py-3 text-[14px] font-body text-darkgrey bg-yellow transition-opacity duration-200 lg:text-[20px]
            ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!isFormValid}
          >
            {isPending ? (
              <span className="loading loading-dots loading-md gap-2"></span>
            ) : (
              "Reset"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
