import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Toaster } from "react-hot-toast";
import { login } from "../services/authService";
import Cookies from "js-cookie";
import useAuthStore from "../stores/useAuthStore";
import { AxiosError } from "axios";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser, login: setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data.email, data.password);

      if (response.user.role !== "superadmin") {
        toast.error("Unauthorized access. Admin privileges required.");
        return;
      }

      // Store tokens
      Cookies.set("token", response.accessToken, {
        expires: 60 * 60 * 1000,
      });
      Cookies.set("refreshToken", response.refreshToken, {
        expires: 7 * 24 * 60 * 60 * 1000,
      });

      // Update auth state
      setAuth(response.accessToken);
      setUser(response.user);

      navigate("/admin/dashboard");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to login");
      } else {
        toast.error("Failed to login");
      }
    }
  };

  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <div className="min-h-screen flex items-center justify-center bg-base-100 font-body">
        <div className="card w-80 md:w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center mb-4">
              Admin Login
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.email.message}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className={`input input-bordered ${errors.password ? "input-error" : ""}`}
                />
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.password.message}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn w-full bg-yellow text-darkgrey border-none text-[16px] font-body font-medium px-10 rounded py-0 hover:bg-yellow mt-5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
