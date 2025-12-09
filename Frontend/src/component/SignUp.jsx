import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const SignUp = () => {
  // Simple state for form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* LEFT SIDE: Image & Branding (Hidden on mobile) */}
      <div className="hidden md:flex w-1/2 bg-green-900 relative justify-center items-center overflow-hidden">
        <img
          src="/images/Background_3.jpg"
          alt="Healthy Canteen Food"
          className="absolute w-full h-full object-cover opacity-50"
        />

        <div className="relative z-10 text-center px-8 text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome Aboard!</h1>
          <p className="text-xl text-green-100 leading-relaxed">
            Join our community and say goodbye to long canteen queues.
            <br />
            Fresh meals are just a tap away.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Sign Up Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-2">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create an Account
            </h2>
            <p className="text-gray-500">
              Let's get you started! Fill in the details below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit()} className="flex flex-col gap-6">
            {/* Full Name Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  {...register("fullName", {
                    required: "The FullName is required",
                  })}
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
                {errors.fullName && (
                  <p className="text-red-500">{errors?.fullName.message}</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  {...register("email", {
                    required: "The email field is required",
                  })}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
                {errors.email && (
                  <p className="text-red-500">{errors?.email.message}</p>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  {...register("password", {
                    required: "The password field is required.",
                  })}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500">{errors?.password.message}</p>
                )}
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  {...register("confirmPassword", {
                    required: "The ConfirmPassword field is required",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors?.confirmPassword && (
                  <p className="text-red-500">
                    {errors?.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              Register
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-bold hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
