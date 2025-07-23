import { Button, Input, PasswordInput } from "@/components/ui";
import { Form } from "@heroui/form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { LoginSchema, type LoginSchemaType } from "../schemas/loginSchema";

export default function LoginPage() {
  const { handleSubmit, control } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle form submission
  const handleLogin = (data: LoginSchemaType) => {
    console.log("Login data:", data);
  };

  return (
    <section>
      <h1 className="mb-3 text-3xl font-bold">Welcome Back</h1>
      <p className="mb-6">Please enter your details to login</p>
      <Form validationBehavior="aria" onSubmit={handleSubmit(handleLogin)}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              isRequired
              isInvalid={invalid}
              errorMessage={error?.message}
              label="Email"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <PasswordInput
              {...field}
              isRequired
              isInvalid={invalid}
              errorMessage={error?.message}
              label="Password"
            />
          )}
        />
        <div className="my-2 flex w-full items-center justify-end">
          <Link to="#" className="underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth color="primary">
          Login
        </Button>
        <DevTool control={control} />
      </Form>
    </section>
  );
}
