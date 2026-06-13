import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OTPInput from '../OTPInput';
import { loginSendOTP, loginVerifyOTP, resendOTP } from '../../api/auth';
import { useOTPTimer } from '../../hooks/useOTPTimer';

const LoginForm = () => {
  const navigate = useNavigate();

  // Step 1: Credentials
  const [step, setStep] = useState('credentials'); // 'credentials' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { canResend, formatTime, resetTimer } = useOTPTimer(180);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      await loginSendOTP(email, password);
      setStep('otp');
      setMessage(`OTP sent to ${email}`);
      setOtp('');
      resetTimer();
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    setError('');
    setMessage('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginVerifyOTP(email, otp);

      // Store token and user data
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      setMessage('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await resendOTP(email, 'login');
      setMessage('New OTP sent to your email');
      setOtp('');
      resetTimer();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'credentials') {
    return (
      <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          />
        </div>

        {error && <div style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>{error}</div>}
        {message && <div style={{ color: '#16a34a', fontSize: '14px', fontWeight: '500' }}>{message}</div>}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 16px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: isLoading ? '#9ca3af' : '#6366f1',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
    );
  }

  // OTP Step
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Verification code sent to</p>
        <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{email}</p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: '#374151' }}>
          Enter OTP
        </label>
        <OTPInput value={otp} onChange={setOtp} onComplete={setOtp} />
      </div>

      {error && <div style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>{error}</div>}
      {message && <div style={{ color: '#16a34a', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>{message}</div>}

      <button
        type="button"
        onClick={handleOTPVerify}
        disabled={isLoading || otp.length !== 6}
        style={{
          padding: '10px 16px',
          fontSize: '16px',
          fontWeight: '600',
          color: '#fff',
          backgroundColor: isLoading || otp.length !== 6 ? '#9ca3af' : '#6366f1',
          border: 'none',
          borderRadius: '8px',
          cursor: isLoading || otp.length !== 6 ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        {isLoading ? 'Verifying...' : 'Verify & Login'}
      </button>

      <div style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
        {canResend ? (
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isLoading}
            style={{
              color: '#6366f1',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
            }}
          >
            Resend OTP
          </button>
        ) : (
          <span>Resend OTP in {formatTime()}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          setStep('credentials');
          setError('');
          setMessage('');
          setOtp('');
        }}
        style={{
          color: '#6366f1',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'center',
        }}
      >
        Use a different email
      </button>
    </div>
  );
};

export default LoginForm;
