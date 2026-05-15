import { headerNavLinks } from "@/lib/routing";

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="border-t border-luxe-silver/30 bg-luxe-black">
      <div className="mx-auto max-w-screen-2xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a
              href={`/${locale}`}
              className="font-display text-xl tracking-[0.15em] text-luxe-gold"
            >
              LUXE
            </a>
            <p className="mt-3 text-xs leading-relaxed text-luxe-silver/50 max-w-xs">
              Curating the finest in luxury since 2026.
            </p>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-luxe-silver/40 mb-4">
              Navigation
            </h4>
            <div className="space-y-2">
              {headerNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="block text-sm text-luxe-silver/60 transition-colors hover:text-luxe-gold"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-luxe-silver/40 mb-4">
              Support
            </h4>
            <div className="space-y-2 text-sm text-luxe-silver/60">
              <p>contact@luxe.store</p>
              <p>+1 (800) LUXE-2026</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-luxe-silver/40 mb-4">
              Legal
            </h4>
            <div className="space-y-2 text-sm text-luxe-silver/60">
              <a
                href={`/${locale}/privacy`}
                className="block transition-colors hover:text-luxe-gold"
              >
                Privacy
              </a>
              <a
                href={`/${locale}/terms`}
                className="block transition-colors hover:text-luxe-gold"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-luxe-silver/10 pt-8 text-center text-xs text-luxe-silver/30">
          &copy; {new Date().getFullYear()} LUXE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
