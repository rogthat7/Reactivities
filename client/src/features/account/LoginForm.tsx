import { useAccount } from "../../lib/hooks/useAccount";
import { loginSchema, LoginSchema } from "../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const [notVerified, setNotVerified] = useState(false);
  const { loginUser, resendConfirmationEmail } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<LoginSchema>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
  });
  const email = watch("email");
  const handleEmailResend = async () => {
    await resendConfirmationEmail
      .mutateAsync({ email })
      .then(() => {
        alert("Confirmation email sent");
      })
      .catch((error) => console.log(error))
      .finally(() => setNotVerified(false));
  };
  const onSubmit = async (data: LoginSchema) => {
    await loginUser.mutateAsync(data, {
      onSuccess: () => {
        navigate(location.state?.from || "/activities");
      },
      onError: (error) => {
        if (error.message === "NotAllowed") {
          setNotVerified(true);
        }
      },
    });
  };
  return (
    <Paper
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 3,
        gap: 3,
        maxWidth: "md",
        mx: "auto",
        borderRadius: 3,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={3}
        color="secondary.main"
      >
        <LockOpen fontSize="large" />
        <Typography variant="h4">Sign in </Typography>
      </Box>
      <TextInput label="Email" control={control} name="email" />
      <TextInput
        type="password"
        label="Password"
        control={control}
        name="password"
      />
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        variant="contained"
        size="large"
      >
        Login
      </Button>
      {notVerified ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography textAlign="center" color="error">
            Your email is not verified. Please check your inbox. Please click
            the button below to resend the verification email.
          </Typography>
          <Button
            disabled={resendConfirmationEmail.isPending}
            onClick={handleEmailResend}
          >
            Resend Verification Email
          </Button>
        </Box>
      ) : (
        <Box display={"flex"} justifyContent="center" gap={3} alignItems="center">
          <Typography> Forgot Password? Click <Link to='/forgot-password'>here</Link> </Typography>
          <Typography sx={{ textAlign: "center" }}>
            Don't have an account?
            <Typography
              component={Link}
              to="/register"
              color="primary"
              sx={{ ml: 2 }}
            >
              Sign up
            </Typography>
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
