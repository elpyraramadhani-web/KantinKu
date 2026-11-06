import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/componets/Navbar";

export const metadara: Metadata = {
  title: "KantinKu",
  description: "Katalog dan Pemesana Makanan Kantin Sekolah"
};

export default function Rootlayout ({children}: LayoutProps<"/">) {
  return(
    <html lang="id" className="antialiased">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 py-6">{children}</main>
        <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">
          KantinKu · dibuat di kelas Junior Web Developer
        </footer>
      </body>
    </html>
  )
}