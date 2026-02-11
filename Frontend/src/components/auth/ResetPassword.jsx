import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate /* useParams */ } from "react-router-dom";
import AuthLayout from "./shared/AuthLayout";
import AuthInput from "./shared/AuthInput";
import AuthButton from "./shared/AuthButton";

const ResetPassword = () => {
  /* const { token } = useParams(); */
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // API logic
    navigate("/login");
  };

  return (
    <AuthLayout
      imageSrc="/images/Background_1.jpg"
      title={
        <>
          Reset
          <br />
          <span className="text-emerald-300">Password</span>
        </>
      }
      subtitle="Enter your new password below to secure your account."
    >
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">New Password</h2>
        <p className="text-gray-500">Please choose a strong password.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthInput
          label="New Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
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

        <AuthInput
          label="Confirm New Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={Lock}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-green-600 transition-colors duration-200"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          required
        />

        <AuthButton type="submit">Reset Password</AuthButton>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
