import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyRound, Lock, Mail, User } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { matchPassword, required, validateEmail, validatePassword } from "../../utils/validators";
import useAuth from "../../hooks/useAuth";

const RegisterForm = () => {
  const { register: signup, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const { register: registerAccount, verifyRegisterOtp } = useAuth();
  const [otpSession, setOtpSession] = useState(null);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const password = watch("password", "");

  const onSubmit = async (values) => {
    setFormMessage("");
    setFormError("");

    try {
      if (!otpSession) {
        const data = await registerAccount(values);
        setOtpSession({ email: data.email });
        setFormMessage(`OTP sent to ${data.email}`);
        return;
      }

      await verifyRegisterOtp({ email: otpSession.email, otp: values.otp });
    } catch (error) {
      setFormError(error?.response?.data?.message || error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {!otpSession ? (
        <>
          <Input
            label="Full name"
            placeholder="Jane Doe"
            icon={<User size={18} />}
            error={errors.name?.message}
            {...signup("name", { required })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            {...signup("email", { required, validate: validateEmail })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            icon={<Lock size={18} />}
            error={errors.password?.message}
            {...signup("password", { required, validate: validatePassword })}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            icon={<Lock size={18} />}
            error={errors.confirmPassword?.message}
            {...signup("confirmPassword", {
              required,
              validate: (value) => matchPassword(value, password),
            })}
          />
        </>
      ) : (
        <Input
          label="OTP"
          type="text"
          inputMode="numeric"
          placeholder="Enter 6-digit OTP"
          icon={<KeyRound size={18} />}
          error={errors.otp?.message}
          {...signup("otp", {
            required,
            pattern: {
              value: /^\d{6}$/,
              message: "Enter the 6-digit OTP sent to your email.",
            },
          })}
        />
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (otpSession ? "Verifying..." : "Sending OTP...") : otpSession ? "Verify OTP" : "Create account"}
      </Button>
      {formMessage && <p className="text-center text-sm font-medium text-emerald-600">{formMessage}</p>}
      {formError && <p className="text-center text-sm font-medium text-rose-600">{formError}</p>}
      {otpSession && (
        <button
          type="button"
          className="w-full text-sm font-medium text-brand-600 hover:text-brand-700"
          onClick={() => setOtpSession(null)}
        >
          Use a different email
        </button>
      )}
    </form>
  );
};

export default RegisterForm;
