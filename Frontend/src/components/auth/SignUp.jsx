import React, { useState, useMemo } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from './shared/AuthLayout';
import AuthInput from './shared/AuthInput';
import AuthButton from './shared/AuthButton';
import SocialAuthButton from './shared/SocialAuthButton';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Please agree to the Terms of Service");
      return;
    }
    // Add auth logic here
  };

  // Password strength
  const passwordStrength = useMemo(() => {
    const pw = formData.password;
    if (!pw) return { level: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-400' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-orange-400' };
    if (score <= 3) return { level: 3, label: 'Good', color: 'bg-yellow-400' };
    if (score <= 4) return { level: 4, label: 'Strong', color: 'bg-green-400' };
    return { level: 5, label: 'Very Strong', color: 'bg-green-600' };
  }, [formData.password]);

  const leftContent = (
    <div className="flex flex-col gap-4">
      {[
        'Skip the canteen queue forever',
        'Pre-order meals ahead of time',
        'Track your daily nutrition',
      ].map((benefit) => (
        <div key={benefit} className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
            <Check size={14} className="text-emerald-300" />
          </div>
          <span className="text-green-100/90 text-sm">{benefit}</span>
        </div>
      ))}
    </div>
  );

  return (
    <AuthLayout
      imageSrc="/images/Background_3.jpg"
      title={<>Join the<br /><span className="text-emerald-300">MealMate family.</span></>}
      subtitle="Create your account and start ordering fresh meals in minutes."
      extraLeftContent={leftContent}
    >
      <div className="mb-6 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
        <p className="text-gray-500">Let's get you started! Fill in the details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          icon={User}
          required
        />

        <AuthInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="john@college.edu"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          required
        />

        <AuthInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
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

        {/* Password Strength Bar */}
        {formData.password && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200'
                    }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-500">{passwordStrength.label}</span>
          </div>
        )}

        <AuthInput
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
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

        <label className="flex items-start gap-2.5 cursor-pointer select-none mt-1">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600"
            required
          />
          <span className="text-sm text-gray-500 leading-snug">
            I agree to the{' '}
            <a href="#" className="text-green-600 font-medium hover:text-green-700 transition-colors duration-200">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-green-600 font-medium hover:text-green-700 transition-colors duration-200">
              Privacy Policy
            </a>
          </span>
        </label>

        <AuthButton type="submit">Create Account</AuthButton>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-gray-400 text-sm font-medium">or continue with</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      <SocialAuthButton onClick={() => { }} />

      <p className="text-center text-gray-500 mt-7">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
