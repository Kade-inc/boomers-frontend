import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import useSignin from "../hooks/useSignin";

const schema = z.object({
  accountId: z.string().min(1),
  password: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

const LoginForm = () => {
  const mutation = useSignin();

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Error:", error);
    }
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
        <p className="py-[2.6%] text-[25px] font-semibold font-body">
          Enter your credentials to sign in
        </p>
        <Toaster />
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
          <input
            type="password"
            autoComplete="on"
            id="password"
            {...register("password")}
            placeholder="Create a password"
            className="input w-full border border-gray-700 bg-transparent rounded-md font-body placeholder-gray-600 hover:border-gray-700 focus:outline-none"
            style={{ backgroundColor: "transparent" }}
          />
        </div>

        <button
          className="btn w-full bg-[#393E46] text-[20px] mb-[3%] text-white border-none disabled:text-gray-500 font-body hover:bg-black"
          type="submit"
        >
          Sign In
        </button>

        <div className="flex gap-5 justify-center text-center mb-[3%]">
          <div
            className="border-t-2 border-black my-4 flex-grow "
            style={{ width: "200px" }}
          ></div>

          <p className="text-[20px] font-semibold font-body">Or sign In with</p>
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
          Don't have an account?
          <Link to="/">
            <span className="font-bold"> Sign Up</span>
          </Link>
        </p>
        <p className="text-center text-[20px] font-regular text-black font-body font-[600] mt-6">
          Forgot your password
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
