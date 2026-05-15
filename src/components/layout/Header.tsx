import { auth } from "@/lib/auth";
import { CartBadge } from "@/components/cart/CartBadge";

interface HeaderProps {
  locale: string;
}

export async function Header({ locale }: HeaderProps) {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
        <a
          href={`/${locale}`}
          className="font-display text-2xl tracking-[0.15em] text-luxe-gold hover:text-luxe-gold-light transition-colors"
        >
          LUXE
        </a>

        <div className="flex items-center gap-8 text-sm tracking-[0.1em] text-luxe-charcoal/70">
          <a
            href={`/${locale}/products`}
            className="transition-colors hover:text-luxe-black"
          >
            Collection
          </a>
          {session?.user ? (
            <UserMenu user={session.user} locale={locale} />
          ) : (
            <a
              href={`/${locale}/auth/signin`}
              className="transition-colors hover:text-luxe-black"
            >
              Sign In
            </a>
          )}
          <CartBadge className="text-luxe-charcoal/70" />
          <LocaleToggle currentLocale={locale} />
        </div>
      </nav>
    </header>
  );
}

function UserMenu({
  user,
  locale,
}: {
  user: { name?: string | null; image?: string | null; role: string };
  locale: string;
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-2 transition-colors hover:text-luxe-black">
        {user.image ? (
          <img src={user.image} alt="" className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-luxe-charcoal/10 text-xs">
            {(user.name ?? "U")[0]}
          </span>
        )}
        <span className="text-xs">{user.name ?? "Account"}</span>
      </button>
      <div className="invisible absolute right-0 top-full mt-2 flex w-48 flex-col gap-1 rounded-xl border border-white/10 bg-white/90 p-2 opacity-0 shadow-lg backdrop-blur-xl transition-all group-hover:visible group-hover:opacity-100">
        {user.role === "admin" && (
          <a
            href={`/${locale}/admin`}
            className="rounded-lg px-3 py-2 text-xs text-luxe-charcoal/60 transition-colors hover:bg-luxe-charcoal/5 hover:text-luxe-charcoal"
          >
            Admin Panel
          </a>
        )}
        <a
          href={`/${locale}/cart`}
          className="rounded-lg px-3 py-2 text-xs text-luxe-charcoal/60 transition-colors hover:bg-luxe-charcoal/5 hover:text-luxe-charcoal"
        >
          My Cart
        </a>
        <hr className="my-1 border-luxe-charcoal/10" />
        <a
          href={`/api/auth/signout`}
          className="rounded-lg px-3 py-2 text-xs text-red-500/60 transition-colors hover:bg-red-500/5 hover:text-red-500"
        >
          Sign Out
        </a>
      </div>
    </div>
  );
}

function LocaleToggle({ currentLocale }: { currentLocale: string }) {
  const localeMap: Record<string, string> = {
    en: "EN", fr: "FR", de: "DE", it: "IT",
    es: "ES", ja: "JP", zh: "CN", ar: "AR",
  };
  const locales = Object.keys(localeMap);
  const next = locales[(locales.indexOf(currentLocale) + 1) % locales.length];

  return (
    <a
      href={`/${next}`}
      className="text-xs tracking-[0.15em] uppercase transition-colors hover:text-luxe-gold"
    >
      {localeMap[currentLocale] ?? currentLocale}
    </a>
  );
}
