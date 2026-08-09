const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:1000/api";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// REGISTER
export const registerUser = async (userData) => {
  return request("/user/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

// VERIFY OTP
export const verifyOTP = async (email, otp) => {
  return request("/user/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      email,
      otp,
    }),
  });
};

// RESEND OTP
export const resendOTP = async (email) => {
  return request("/user/resend-otp", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
};

// LOGIN
export const loginUser = async (email, password) => {
  return request("/user/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

// LOGOUT
export const logoutUser = async () => {
  const token = localStorage.getItem("token");

  return request("/user/logout", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// LOGOUT ALL
export const logoutAllUsers = async () => {
  const token = localStorage.getItem("token");

  return request("/user/logout-form-all", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};