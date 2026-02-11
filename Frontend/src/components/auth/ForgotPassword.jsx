import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from './shared/AuthLayout';
import AuthInput from './shared/AuthInput';
import AuthButton from './shared/AuthButton';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // API call logic here
        setSubmitted(true);
    };

    return (
        <AuthLayout
            imageSrc="/images/Background_1.jpg"
            title={<>Forgot<br /><span className="text-emerald-300">Password?</span></>}
            subtitle="Don't worry, it happens to the best of us. Enter your email below to recover your password."
        >
            <div className="mb-8 text-center lg:text-left">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-4">
                    <ArrowLeft size={16} />
                    Back to Login
                </Link>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-500">We'll send you a reset link.</p>
            </div>

            {!submitted ? (
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

                    <AuthButton type="submit">Send Reset Link</AuthButton>
                </form>
            ) : (
                <div className="text-center bg-green-50 p-6 rounded-xl border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <Mail size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        We've sent a password reset link to <strong>{email}</strong>.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="text-green-600 font-semibold hover:text-green-700 text-sm"
                    >
                        Didn't receive it? Click to resend
                    </button>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
