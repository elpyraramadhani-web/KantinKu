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
  const [daftar, setDaftar] = useState<Pesanan[] | null>(null);

  useEffect(() => {
    let data: Pesanan[] = [];
    try {
      data = JSON.parse(localStorage.getItem("riwayat") ?? "[]");
    } catch {
      data = [];
    }
    //urut bedasarkan waktu
    data.sort((a, b) => b.waktu.localeCompare(a.waktu))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDaftar(data);
  }, []);

  function hapusRiwayat(indeks: number, p: Pesanan){
    if(!daftar) return;
    const yakin = window.confirm(
      `Hapus pesanan atas nama ${p.nama} (${rupiah(p.total)})?`
    );
    if (!yakin) return;

    const baru = daftar.filter((_, i) => i !== indeks);
    setDaftar(baru);
    localStorage.setItem("riwayat", JSON.stringify(baru));
  }

  if (daftar === null) return null;

  if (daftar.length === 0) {
    return <p className="text-slate-500">Belum ada pesanan.</p>;
  }
  
  const totalBelanja = daftar.reduce((total, p) => total + p.total, 0)
 return (
    <div className="space-y-4">
      <p className="font-medium">
        {daftar.length} pesanan, total belanja {rupiah(totalBelanja)}
      </p>

      <ul className="space-y-4">
        {daftar.map((p, i) => (
          <li
            key={`${p.waktu}-${i}`}
            className="space-y-1 rounded-xl border bg-white p-4 text-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-slate-500">
                {new Date(p.waktu).toLocaleString("id-ID")}
              </p>
              <button
                onClick={() => hapusRiwayat(i, p)}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
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
    </div>
  );
}