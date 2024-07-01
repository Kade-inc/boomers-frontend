const SignupForm = () => {
  return (
    <div className="text-[#393E46]">
      <form className="p-8 w-full">
        <h1>SIGN UP</h1>
        <p>Create an account to begin your journey</p>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Confirm password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="input input-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Sign Up
        </button>
        <p>Or sign up with</p>
        <button type="submit" className="btn btn-primary w-full">
          Google
        </button>

        <p>Already have an account? Sign in</p>
      </form>
    </div>
  );
};

export default SignupForm;
