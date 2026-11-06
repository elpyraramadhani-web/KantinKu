"use client";
import { useState } from "react";
import { menu, type Menu } from "@/data/menu";
import KartuMenu from "./KartuMenu";
import KontrolMenu from "./KontrolMenu";

export default function KatalogMenu({ items }: { items: Menu[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("awal");

  const daftarKategori = ["Semua", ...new Set(menu.map((e) => e.kategori))];
  const hasil = menu.filter(
    (e) =>
      e.nama.toLowerCase().includes(cari.toLowerCase()) &&
      (kategori === "Semua" || e.kategori === kategori)
  );

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === "murah") {
      return a.harga - b.harga;
    }
    if (urut === "mahal") {
      return b.harga - a.harga;
    }
    if (urut === "nama") {
      return a.nama.localeCompare(b.nama);
    }
    return 0;
  });

  return (
    <div>
      <KontrolMenu
        cari={cari} onCari={setCari}
        kategori={kategori} onKategori={setKategori}
        daftarKategori={daftarKategori}
        urut={urut} onUrut={setUrut}
      />

      {tersusun.length === 0 ? (
        <p className="text-slate-500">Menu tidak ditemukan.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tersusun.map((m) => (
            <KartuMenu key={m.id} item={m} />
          ))}
        </div>
      )}
    </div>
  );
}