import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  verifyOTP,
  resendOTP,
} from "../services/authApi";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const [email] = useState(
    sessionStorage.getItem("verifyEmail") || ""
  );

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyOTP(email, otp);

      setMessage(response.message);

      sessionStorage.removeItem("verifyEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    try {
      setResending(true);

      const response = await resendOTP(email);

      setMessage(response.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white text-2xl font-bold shadow-lg">
            G
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Verify Email
          </h1>

          <p className="text-gray-500 mt-2">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl bg-green-50 border border-green-200 text-green-600 px-4 py-3 text-sm">
              {message}
            </div>
          )}

          <p className="text-sm text-gray-500 mb-5 text-center">
            {email}
          </p>

          <form onSubmit={handleVerify}>

            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="000000"
              className="w-full text-center tracking-[0.5em] text-2xl font-bold px-4 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-lg disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

          </form>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full mt-4 py-3 rounded-xl text-indigo-600 font-semibold hover:bg-indigo-50 transition"
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Wrong email?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600"
            >
              Register again
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;