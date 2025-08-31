import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [showOtp, setShowOtp] = useState<boolean>(false);

  const handleGetOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await API.post("/auth/login/send-otp", { email });
      alert("OTP sent to your email!");
      setStep(2);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/notes");
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8 gap-2">
            <div className="rounded-full border border-blue-500 p-1">
              <svg
                className="w-5 h-5 text-blue-600 animate-spin"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                />
              </svg>
            </div>
            <span className="font-semibold text-lg text-gray-700 select-none">HD</span>
          </div>

          <h1 className="text-2xl font-bold mb-2">Sign in</h1>
          <p className="text-gray-500 mb-6 text-sm">
            Please login to continue to your account.
          </p>

          <form onSubmit={step === 1 ? handleGetOtp : handleVerifyOtp} className="space-y-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />

            {step === 2 && (
              <>
                <label className="block text-gray-700 text-sm font-semibold mb-1 mt-4" htmlFor="otp">
                  OTP
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    type={showOtp ? "text" : "password"}
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {/* Show/hide icon */}
                  </button>
                </div>

                <p
                  className="text-sm text-blue-600 hover:underline cursor-pointer mt-1"
                  onClick={() => setStep(1)}
                >
                  Resend OTP
                </p>
              </>
            )}

            <div className="flex items-center mt-4 space-x-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
              <label htmlFor="remember" className="text-sm font-semibold text-gray-600">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              className="mt-5 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold text-sm"
            >
              {step === 1 ? "Get OTP" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Need an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:flex flex-1">
        <img
          src="https://wallpaperaccess.com/full/317501.jpg"
          alt="Login Banner"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
