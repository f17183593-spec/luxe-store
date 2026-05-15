"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function SignInButton() {
  return (
    <Button
      variant="gold"
      size="lg"
      className="w-full"
      onClick={() => signIn("google", { redirectTo: "/" })}
    >
      Sign in with Google
    </Button>
  );
}
