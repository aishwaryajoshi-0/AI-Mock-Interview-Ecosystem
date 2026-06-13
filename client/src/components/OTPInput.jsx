import { useRef, useEffect } from 'react';

export default function OTPInput({ value = '', onChange = () => {}, onComplete = () => {} }) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;

    // Only allow digits
    if (!/^\d*$/.test(val)) {
      return;
    }

    // If pasting, handle multiple digits
    if (val.length > 1) {
      const pastedValue = val.split('').slice(0, 6 - index);
      const newOTP = value.split('');
      pastedValue.forEach((digit, i) => {
        newOTP[index + i] = digit;
      });
      const otpString = newOTP.join('').slice(0, 6);
      onChange(otpString);

      // Focus on next empty or last input
      const nextIndex = Math.min(index + pastedValue.length, 5);
      setTimeout(() => {
        inputsRef.current[nextIndex]?.focus();
      }, 0);

      // Trigger complete if all 6 digits filled
      if (otpString.length === 6) {
        onComplete(otpString);
      }
      return;
    }

    // Single digit input
    if (val.length === 1) {
      const newOTP = value.split('');
      newOTP[index] = val;
      const otpString = newOTP.join('').slice(0, 6);
      onChange(otpString);

      // Auto-focus next input
      if (index < 5 && val) {
        inputsRef.current[index + 1]?.focus();
      }

      // Trigger complete if all 6 digits filled
      if (otpString.length === 6) {
        onComplete(otpString);
      }
    } else {
      // Clearing the input
      const newOTP = value.split('');
      newOTP[index] = '';
      onChange(newOTP.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOTP = value.split('');
      newOTP[index] = '';
      onChange(newOTP.join(''));

      // Focus previous input if current is empty
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    onChange(digits);

    // Focus on the last input or position after pasted content
    const focusIndex = Math.min(digits.length, 5);
    setTimeout(() => {
      inputsRef.current[focusIndex]?.focus();
    }, 0);

    if (digits.length === 6) {
      onComplete(digits);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '24px 0' }}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          style={{
            width: '48px',
            height: '56px',
            fontSize: '24px',
            fontWeight: '600',
            textAlign: 'center',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            outline: 'none',
            transition: 'all 0.2s ease',
            backgroundColor: '#ffffff',
            color: '#1f2937',
            boxShadow: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#6366f1';
            e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
          placeholder="0"
        />
      ))}
    </div>
  );
}
