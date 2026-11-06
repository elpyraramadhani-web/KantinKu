"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/", teks: "Beranda" },
  { href: "/menu", teks: "Menu" },
  { href: "/favorit", teks: "Favorit" },
  { href: "/keranjang", teks: "Keranjang" },
  { href: "/riwayat", teks: "Riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    function hitung() {
      let isi: { id: number; jumlah: number }[] = [];
      try {
        isi = JSON.parse(localStorage.getItem("keranjang") ?? "[]");
      } catch {
        isi = [];
      }
      setJumlah(isi.reduce((total, k) => total + k.jumlah, 0));
    }

    hitung(); // hitung sekali saat Navbar tampil
    window.addEventListener("keranjang-berubah", hitung);
    return () => window.removeEventListener("keranjang-berubah", hitung);
  }, []);

  return (
    <nav className="flex items-center gap-6 border-b bg-white px-6 py-3">
      <span className="text-lg font-bold text-blue-600">KantinKu</span>
      {menu.map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className={
            pathname === m.href
              ? "font-semibold text-blue-600"
              : "text-slate-600 hover:text-blue-600"
          }
        >
          {m.href === "/keranjang" && jumlah > 0
            ? `Keranjang (${jumlah})`
            : m.teks}
        </Link>
      ))}
    </nav>
  );
}