const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Register Step 1: Send OTP to email
 */
export const registerSendOTP = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }

    return data.data || {};
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

/**
 * Register Step 2: Verify OTP and create account
 */
export const registerVerifyOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify OTP');
    }

    return data.data; // { user, token }
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

/**
 * Login Step 1: Verify credentials and send OTP
 */
export const loginSendOTP = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }

    return data.data || {}; // { email, userId }
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

/**
 * Login Step 2: Verify OTP and get JWT
 */
export const loginVerifyOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify OTP');
    }

    return data.data; // { user, token }
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (email, type) => {
  try {
    const response = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, type }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to resend OTP');
    }

    return data.data || {};
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};
