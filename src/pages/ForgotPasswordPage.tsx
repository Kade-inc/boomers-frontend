import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import password from "../assets/password-svgrepo-com 1.svg";
import useForgotPassword from "../hooks/useForgotPassword";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ForgotPasswordSuccess from "../components/ForgotPasswordSuccess";

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const { mutate, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutate(data.email);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  if (isSuccess) {
    return <ForgotPasswordSuccess />;
  }

  return (
    <>
      <div className="text-[#393E46]">
        <div className="flex justify-center flex-col items-center mt-16">
          <img src={password} />
          <p className="font-bold text-[26px] lg:text-[30px] leading-[53px] font-heading">
            Forgot Password?
          </p>
          <p className="py-[2.6%] text-[16px] lg:text-[20px] font-semibold font-body">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form
          className="w-full px-4 py-[2%] md:px-24"
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
          <div className="text-[14px]">
            <div>
              <label
                className="block  font-bold mb-[1%] font-body"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                {...register("email")}
                placeholder="Enter email"
                className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600 "
                style={{ backgroundColor: "transparent" }}
              />
              {errors.email && (
                <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <button
              className="btn w-full bg-[#393E46]  mb-[3%] text-white border-none disabled:text-gray-500 font-body hover:bg-black my-5 text-[17px]"
              type="submit"
              disabled={isPending}
            >
              {isPending ? <span className="loading loading-dots loading-md"></span> : "Reset Password"}
            </button>

            <p className="text-center font-regular text-darkgrey font-body text-[16px]">
              Remember password?
              <Link to="/login">
                <span className="font-bold "> Sign In</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
