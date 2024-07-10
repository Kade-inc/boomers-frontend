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
      <form className="w-full px-24 py-[2%]" onSubmit={handleSubmit(onSubmit)}>
        <p className="font-extrabold text-[50px] leading-[53px]">SIGN UP</p>
        <p className="py-[2.6%] text-[25px] font-semibold">
          Create an account to begin your journey
        </p>
        <Toaster />
        <div className="mb-[3%]">
          <label className="block text-base font-bold mb-[1%]" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            className="input w-full border border-gray-700 bg-transparent rounded-md"
            style={{ backgroundColor: "transparent" }}
            {...register("email")}
            id="email"
          />
        </div>
        {errors.email && (
          <p className="text-red-700">{errors.email?.message}</p>
        )}
        <div className="mb-[3%]">
          <label
            className="block text-base font-bold mb-[1%]"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            className="input w-full border border-gray-700 bg-transparent rounded-md"
            style={{ backgroundColor: "transparent" }}
            {...register("username")}
          />
        </div>
        {errors.username && (
          <p className="text-red-700">{errors.username.message}</p>
        )}
        <div className="mb-[3%]">
          <label
            className="block text-base font-bold mb-[1%]"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            autoComplete="on"
            id="password"
            placeholder="Create a password"
            className="input w-full border border-gray-700 bg-transparent rounded-md"
            style={{ backgroundColor: "transparent" }}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-red-700">{errors.password.message}</p>
        )}
        <div className="mb-[3%]">
          <label
            className="block text-base font-bold mb-[1%]"
            htmlFor="confirmpassword"
          >
            Confirm password
          </label>
          <input
            type="password"
            autoComplete="on"
            id="confirmpassword"
            placeholder="Confirm your password"
            className="input w-full border border-gray-700  rounded-md"
            style={{ backgroundColor: "transparent" }}
            {...register("confirmpassword")}
          />
        </div>
        {errors.confirmpassword && (
          <p className="text-red-700">{errors.confirmpassword.message}</p>
        )}

        <button
          className="btn w-full bg-[#393E46] text-[20px] mb-[3%] disabled:text-gray-500"
          type="submit"
          // disabled={!isValid}
        >
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

        <button
          className="btn bg-white w-full text-[#393E46] border-none text-[20px] mb-[3%]"
          type="button"
        >
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
