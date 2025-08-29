import { createFileRoute, redirect } from "@tanstack/react-router";
import { validateSession } from "../lib/api/auth";
import LoginPage from "../components/LoginPage";

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    // Check if user already has a valid session
    const sessionData = await validateSession();
    
    if (sessionData && sessionData.success) {
      // User is already logged in, redirect to app
      throw redirect({
        to: '/app',
        replace: true
      });
    }
  },
  component: LoginPage
})