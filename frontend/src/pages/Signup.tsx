import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpVisible, setOtpVisible] = useState<boolean>(false);

  // Step 1: Request OTP
  const handleGetOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", { name, dob, email });
      alert("OTP sent to your email!");
      setStep(2);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/verify-signup-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white font-sans">
      {/* Left Section */}
      <div className="flex flex-col justify-center px-12 md:px-28 lg:px-32 w-full md:w-1/2 border-r border-gray-200">
        {/* Top-left HD logo */}
        <div className="flex items-center mb-10 space-x-2">
          <svg
            className="w-6 h-6 animate-spin text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span className="text-black font-semibold text-lg select-none">HD</span>
        </div>

        <h1 className="text-3xl font-semibold mb-1 text-black">Sign up</h1>
        <p className="mb-8 text-gray-500 text-sm">Sign up to enjoy the feature of HD</p>

        <form
          onSubmit={step === 1 ? handleGetOtp : handleVerifyOtp}
          className="space-y-5 max-w-md"
        >
          {step === 1 && (
            <>
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 text-xs text-gray-600">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="dob" className="mb-1 text-xs text-gray-600">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 text-xs text-gray-600">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="flex flex-col relative max-w-md">
              <label htmlFor="otp" className="mb-1 text-xs text-gray-600">
                OTP
              </label>
              <input
                id="otp"
                type={otpVisible ? "text" : "password"}
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border border-gray-300 rounded-md p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setOtpVisible(!otpVisible)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={otpVisible ? "Hide OTP" : "Show OTP"}
                tabIndex={-1}
              >
                {otpVisible ? (
                  // Eye icon open
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // Eye icon closed
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.959 9.959 0 012.668-4.492M3 3l18 18"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.88 9.88a3 3 0 104.24 4.24"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-sm hover:bg-blue-700 transition"
          >
            {step === 1 ? "Get OTP" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-xs max-w-md mx-auto">
          Already have an account??{" "}
          <Link to="/signin" className="text-blue-600 hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:flex md:w-1/2">
        <img
          src="https://wallpaperaccess.com/full/317501.jpg"
          alt="Signup Banner"
          className="h-full w-full object-cover rounded-tr-3xl rounded-br-3xl"
          style={{ borderTopRightRadius: "1.5rem", borderBottomRightRadius: "1.5rem" }}
        />
      </div>
    </div>
  );
};

export default Signup;
