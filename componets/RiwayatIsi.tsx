"use client";
import { useEffect, useState } from "react";
import { rupiah } from "@/data/menu";

type Pesanan = {
  nama: string;
  cara: "ambil" | "antar";
  kelas: string;
  baris: { nama: string; jumlah: number; subtotal: number }[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
  waktu: string;
};

export default function RiwayatIsi() {
  // null = belum dibaca dari localStorage
  const [daftar, setDaftar] = useState<Pesanan[] | null>(null);

  useEffect(() => {
    let data: Pesanan[] = [];
    try {
      data = JSON.parse(localStorage.getItem("riwayat") ?? "[]");
    } catch {
      data = [];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDaftar(data);
  }, []);

  if (daftar === null) return null;

  if (daftar.length === 0) {
    return <p className="text-slate-500">Belum ada pesanan.</p>;
  }

  return (
    <ul className="space-y-4">
      {daftar.map((p) => (
        <li
          key={p.waktu}
          className="space-y-1 rounded-xl border bg-white p-4 text-slate-900"
        >
          <p className="text-sm text-slate-500">
            {new Date(p.waktu).toLocaleString("id-ID")}
          </p>
          <p className="font-semibold">Pemesan: {p.nama}</p>
          {p.baris.map((b) => (
            <p key={b.nama}>
              {b.nama} x{b.jumlah} = {rupiah(b.subtotal)}
            </p>
          ))}
          <p className="border-t pt-1">Subtotal: {rupiah(p.subtotal)}</p>
          {p.diskon > 0 && <p>Diskon: -{rupiah(p.diskon)}</p>}
          <p>
            {p.cara === "antar"
              ? `Ongkir antar ke ${p.kelas}: ${rupiah(p.ongkir)}`
              : "Diambil sendiri di kantin"}
          </p>
          <p className="font-bold">Total bayar: {rupiah(p.total)}</p>
        </li>
      ))}
    </ul>
  );
}