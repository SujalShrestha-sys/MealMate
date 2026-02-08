<<<<<<< HEAD:Frontend/src/component/Login.jsx
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Hamburger } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
=======
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Hamburger } from 'lucide-react';
import { Link } from "react-router-dom"

>>>>>>> 16a4050120c1d3f86379ed7ae9d6dcef44a2a2fa:Frontend/src/components/auth/Login.jsx

const Login = () => {
  // Simple state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

<<<<<<< HEAD:Frontend/src/component/Login.jsx
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  return (
=======
  return (      
>>>>>>> 16a4050120c1d3f86379ed7ae9d6dcef44a2a2fa:Frontend/src/components/auth/Login.jsx
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* LEFT SIDE: Image & Branding (Hidden on mobile, visible on medium screens and up) */}
      <div className="hidden md:flex w-1/2 bg-green-900 relative justify-center items-center overflow-hidden">
        {/* Background Image */}
        <img
          src="/images/Background_2.jpg"
          alt="Canteen Food"
          className="absolute w-full h-full object-cover opacity-60"
        />

        {/* Text Overlay */}
        <div>
          <div className="flex items-center">
            <Hamburger size={48} className="text-orange-600 m-2" />
            <h1 className="relative z-10 text-center text-5xl font-bold text-white ">
              MealMate
            </h1>
          </div>
          <p className="text-xl text-center text-green-100">
            Skip the canteen queue.
            <br />
            Order fresh, eat fresh.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-500">Please enter your details to login.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit()} className="flex flex-col gap-5">
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  {
                  ...register("email", {
                    required: "Email field is required"
                  })
                  }
                  type="email"
                  id="email"
                  placeholder="john@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
                {
                  errors?.email && (
                    <p className="text-red-500">{errors?.email.message}</p>
                  )
                }
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  {
                  ...register("password", {
                    required: "Password field is required"
                  })
                  }
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />

                {/* Toggle Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500">{errors?.password.message}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm text-green-600 font-semibold hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-600/20 active:scale-95"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/SignUp"
              className="text-green-600 font-bold hover:underline"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
