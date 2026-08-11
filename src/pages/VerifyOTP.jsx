// pages/VerifyOTP.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP } from "../services/authApi";
import { FiCheckCircle, FiClock, FiRefreshCw } from "react-icons/fi";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("verifyEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      navigate("/register");
    }

    // Start timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOTP({ email, otp });
      setSuccess(response.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      setError("");
      await resendOTP(email);
      setSuccess("OTP resent successfully!");
      setTimer(60);
      setCanResend(false);
      
      // Restart timer
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
              <FiCheckCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
            <p className="text-gray-500 mt-2">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-200 text-green-600 px-4 py-3 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{" "}
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-indigo-600 font-medium hover:text-indigo-700 transition disabled:opacity-50 flex items-center gap-1 mx-auto"
                >
                  <FiRefreshCw className={`w-4 h-4 ${resendLoading ? "animate-spin" : ""}`} />
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              ) : (
                <span className="text-gray-400 flex items-center gap-1 justify-center">
                  <FiClock className="w-4 h-4" />
                  Resend in {timer}s
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;