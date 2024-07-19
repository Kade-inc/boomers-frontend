import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import useSignup from "../hooks/useSignup";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useSignUpStore from "../stores/store";

const schema = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
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
  const navigate = useNavigate();
  const mutation = useSignup();
  const setSignUpSuccess = useSignUpStore((s) => s.setSignUpSuccess);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const { confirmpassword, ...userData } = data;
    console.log(userData);
    try {
      await mutation.mutateAsync(userData);
      setSignUpSuccess(true)
      navigate("/signup-success");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="text-darkgrey">
      <form
        className="w-full px-4 py-[2%] md:px-24"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="block md:hidden font-heading text-[30px]">LOGO</h2>
        <p className="font-extrabold text-[50px] leading-[53px] font-heading">
          SIGN UP
        </p>
        <p className="py-[2.6%] text-[18px] font-semibold font-body">
          Create an account to begin your journey.
        </p>
        <Toaster 
        position="bottom-center" 
        reverseOrder={true}
        toastOptions={{
          error: {
            style: {
              background: '#D92D2D',
              color: 'white'
            },
            iconTheme: {
              primary: 'white',
              secondary: '#D92D2D',
            },
          },
        }}/>
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
            className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
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
            className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
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
          <input
            type="password"
            autoComplete="on"
            id="password"
            placeholder="Create a password"
            className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
            style={{ backgroundColor: "transparent" }}
            {...register("password")}
          />
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
          <input
            type="password"
            autoComplete="on"
            id="confirmpassword"
            placeholder="Confirm your password"
            className="input w-full border border-gray-700  rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
            style={{ backgroundColor: "transparent" }}
            {...register("confirmpassword")}
          />
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

        <div className="flex items-center gap-5 justify-center text-center mb-[3%]">
          <div className="border-t-2 border-darkgrey my-4 flex-grow w-200"></div>

          <p className="font-semibold font-body">Or sign up with</p>
          <div className="border-t-2 border-darkgrey my-4 flex-grow w-200"></div>
        </div>

        <button
          className="btn bg-white w-full text-[#393E46] text-[17px] border-none mb-[3%] font-body"
          type="button"
        >
          <FcGoogle style={{ fontSize: "1.5em" }} /> Google
        </button>

        <p className="text-center font-regular text-darkgrey font-body">
          Already have an account? {' '}
          <Link to="/login">
            <span className="font-bold">Sign in</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
