import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const display = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Neat Freak Gifts | One Stop Shop for Personal, Unique Gifts",
  description:
    "Fun, festive gifts from our 5-year Etsy shop: books by color, candy by color, blind date with a book, and unique finds for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
