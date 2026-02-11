import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "./shared/AuthLayout";
import AuthInput from "./shared/AuthInput";
import AuthButton from "./shared/AuthButton";
import SocialAuthButton from "./shared/SocialAuthButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add auth logic here
  };

  const leftContent = (
    <div className="flex gap-8">
      <div>
        <p className="text-2xl font-semibold text-white">1000+</p>
        <p className="text-sm font-medium text-green-200/80">Happy Students</p>
      </div>
      <div className="w-px bg-white/20" />
      <div>
        <p className="text-2xl font-semibold text-white">Fresh</p>
        <p className="text-sm font-medium text-green-200/80">Meals Daily</p>
      </div>
      <div className="w-px bg-white/20" />
      <div>
        <p className="text-2xl font-semibold text-white">5 min</p>
        <p className="text-sm font-medium text-green-200/80">Avg. Pickup</p>
      </div>
    </div>
  );

  return (
    <AuthLayout
      imageSrc="/images/Background_2.jpg"
      title={
        <>
          Skip the queue,
          <br />
          <span className="text-emerald-300">savor every bite.</span>
        </>
      }
      subtitle="Order fresh meals from your college canteen — no waiting, no hassle."
      extraLeftContent={leftContent}
    >
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-500">
          Enter your credentials to access your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="john@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          required
        />

        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-green-600 transition-colors duration-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors duration-200"
          >
            Forgot Password?
          </Link>
        </div>

        <AuthButton type="submit">Sign In</AuthButton>
      </form>

      <div className="flex items-center gap-4 my-7">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-gray-400 text-sm font-medium">
          or continue with
        </span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      <SocialAuthButton onClick={() => {}} />

      <p className="text-center text-gray-500 mt-8">
        Don't have an account?{" "}
        <Link
          to="/SignUp"
          className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
        >
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
