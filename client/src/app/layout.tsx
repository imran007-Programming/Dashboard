import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk, Space_Mono } from "next/font/google";
import Link from "next/link";
import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Devfolio Hub",
    template: "%s | Devfolio Hub",
  },
  description: "Submit your projects and get them reviewed by mentors.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${archivoBlack.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">{children}</main>
          <div className="zigzag" aria-hidden />
          <footer className="bg-ink text-cream">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
              <div>
                <Link href="/" className="inline-flex items-center gap-2" aria-label="Devfolio Hub home">
                  <span className="border-[3px] border-cream bg-yellow px-2 py-0.5 font-display text-lg text-ink shadow-[3px_3px_0_0_var(--color-cream)]">
                    DEVFOLIO
                  </span>
                  <span className="font-display text-lg">/HUB</span>
                </Link>
                <p className="mt-4 max-w-xs font-medium text-cream/70">Submit your projects, get them reviewed, ship them.</p>
              </div>

              <nav aria-label="Footer" className="flex flex-wrap gap-3">
                {[
                  { href: "/projects", label: "Projects", color: "bg-yellow" },
                  { href: "/projects/new", label: "New project", color: "bg-green" },
                  { href: "/login", label: "Login", color: "bg-pink" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`border-[3px] border-cream ${link.color} px-3 py-1.5 font-mono text-xs font-bold text-ink uppercase shadow-[3px_3px_0_0_var(--color-cream)] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-cream)]`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-t-[3px] border-cream/20">
              <p className="mx-auto max-w-6xl px-4 py-4 font-mono text-xs text-cream/60 sm:px-6">© Devfolio Hub · Made for students</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
