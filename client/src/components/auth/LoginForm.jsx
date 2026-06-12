import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyRound, Lock, Mail } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { required, validateEmail, validatePassword } from "../../utils/validators";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const { login, verifyLoginOtp } = useAuth();
  const [otpSession, setOtpSession] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    if (!otpSession) {
      const data = await login({ email: values.email, password: values.password });
      setOtpSession({ userId: data.userId, email: data.email });
      return;
    }

    await verifyLoginOtp({ userId: otpSession.userId, otp: values.otp });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {!otpSession ? (
        <>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            {...register("email", { required, validate: validateEmail })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<Lock size={18} />}
            error={errors.password?.message}
            {...register("password", { required, validate: validatePassword })}
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
          {...register("otp", {
            required,
            pattern: {
              value: /^\d{6}$/,
              message: "Enter the 6-digit OTP sent to your email.",
            },
          })}
        />
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (otpSession ? "Verifying..." : "Sending OTP...") : otpSession ? "Verify OTP" : "Send OTP"}
      </Button>
      {otpSession && (
        <button
          type="button"
          className="w-full text-sm font-medium text-primary-600 hover:text-primary-700"
          onClick={() => setOtpSession(null)}
        >
          Use a different email
        </button>
      )}
    </form>
  );
};

export default LoginForm;
