import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import useSignup from "../hooks/useSignup";
import { Toaster } from "react-hot-toast";

const schema = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(15, "Password must be no more than 15 characters long")
      .regex(
        /[A-Za-z]/,
        "Password must contain at least one alphabet (uppercase or lowercase)"
      )
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[-.@$!%+=<>,#?&]/,
        "Password must contain at least one special character (-,.,@,$,!,%,+,=,<,>,#,?,&)"
      ),
    confirmpassword: z.string(),
  })
  .refine(data => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

type FormData = z.infer<typeof schema>;

const SignupForm = () => {
  const mutation = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    const { confirmpassword, ...userData } = data; // Exclude confirmpassword
    console.log(userData);
    mutation.mutate(userData);
  };

  return (
    <div className="text-[#393E46]">
      <form
        className="w-full px-4 py-[2%] md:px-24"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="font-extrabold text-[50px] leading-[53px] font-heading">SIGN UP</p>
        <p className="py-[2.6%] text-[25px] font-semibold font-body">
          Create an account to begin your journey
        </p>
        <Toaster />
        <div className="mb-[3%]">
          <label className="block text-base font-bold mb-[1%] font-body" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
            style={{ backgroundColor: "transparent" }}
            {...register("email")}
            id="email"
          />
        </div>
        {errors.email && (
          <p className="text-red-700 font-body">{errors.email?.message}</p>
        )}
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
            className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
            style={{ backgroundColor: "transparent" }}
            {...register("username")}
          />
        </div>
        {errors.username && (
          <p className="text-red-700">{errors.username.message}</p>
        )}
        <div className="mb-[3%]">
          <label
            className="block text-base font-bold mb-[1%] font-body"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            autoComplete="on"
            id="password"
            placeholder="Create a password"
            className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
            style={{ backgroundColor: "transparent" }}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-red-700 font-body">{errors.password.message}</p>
        )}
        <div className="mb-[3%]">
          <label
            className="block text-base font-bold mb-[1%] font-body"
            htmlFor="confirmpassword"
          >
            Confirm password
          </label>
          <input
            type="password"
            autoComplete="on"
            id="confirmpassword"
            placeholder="Confirm your password"
            className="input w-full border border-gray-700  rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
            style={{ backgroundColor: "transparent" }}
            {...register("confirmpassword")}
          />
        </div>
        {errors.confirmpassword && (
          <p className="text-red-700 font-body">{errors.confirmpassword.message}</p>
        )}

        <button
          className="btn w-full bg-[#393E46] text-[20px] mb-[3%] text-white border-none disabled:text-gray-500 font-body "
          type="submit"
          // disabled={!isValid}
        >
          Sign Up
        </button>

        <div className="flex gap-5 justify-center text-center mb-[3%]">
          <div
            className="border-t-2 border-black my-4 flex-grow "
            style={{ width: "200px" }}
          ></div>

          <p className="text-[20px] font-semibold font-body">Or sign up with</p>
          <div
            className="border-t-2 border-black my-4 flex-grow"
            style={{ width: "200px" }}
          ></div>
        </div>

        <button
          className="btn bg-white w-full text-[#393E46] border-none text-[20px] mb-[3%] font-body"
          type="button"
        >
          <FcGoogle style={{ fontSize: "1.5em" }} /> Google
        </button>

        <p className="text-center text-[20px] font-regular text-black font-body">
          Already have an account? <span className="font-bold">Sign in</span>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
