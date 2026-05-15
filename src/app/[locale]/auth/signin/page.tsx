import { GlassPanel } from "@/components/ui/GlassPanel";
import { SignInButton } from "./SignInButton";

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <GlassPanel variant="light" className="w-full max-w-sm space-y-8 text-center">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-luxe-charcoal">
            Welcome to LUXE
          </h1>
          <p className="mt-2 text-xs tracking-[0.1em] text-luxe-charcoal/40">
            Sign in to continue
          </p>
        </div>
        <SignInButton />
      </GlassPanel>
    </div>
  );
}
