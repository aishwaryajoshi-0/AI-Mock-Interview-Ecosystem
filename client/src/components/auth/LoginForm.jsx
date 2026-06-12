import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { required, validateEmail, validatePassword } from "../../utils/validators";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    await login(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginForm;
