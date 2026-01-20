import {
  Signin,
  SignUp,
  IntroPage,
  Aboutus,
  FAQ,
  Privacypolicy,
  OTPVerification,
  ResetPassword,
  NewPasswordForm,
} from "@/Pages";

export const publicRoutes = [
  { path: "/login", element: <Signin /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/home-page", element: <IntroPage /> },
  { path: "/aboutus", element: <Aboutus /> },
  { path: "/frequently-asked-questions", element: <FAQ /> },
  { path: "/privacypolicy", element: <Privacypolicy /> },
  { path: "/verify-otp", element: <OTPVerification /> },
  { path: "/reset-account-password", element: <ResetPassword /> },
  { path: "/verify-reset-token", element: <NewPasswordForm /> },
];
