import { useForm } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { matchPassword, required, validateEmail, validatePassword } from "../../utils/validators";
import useAuth from "../../hooks/useAuth";

const RegisterForm = () => {
  const { register: signup, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const { register: registerAccount } = useAuth();
  const password = watch("password", "");

  const onSubmit = async (values) => {
    await registerAccount(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
