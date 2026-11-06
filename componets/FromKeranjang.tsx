"use client";
import { useState } from "react";
import { rupiah, type Menu } from "@/data/menu";
import { bacaKeranjang, simpanKeranjang } from "@/lib/keranjang";

export default function FormKeranjang({ item }: { item: Menu }) {
  const [jumlah, setJumlah] = useState(1);
  const [error, setError] = useState("");
  const [berhasil, setBerhasil] = useState(false);

  function kirim(e: React.FormEvent) {
    e.preventDefault();
    setBerhasil(false);

    if (!Number.isInteger(jumlah) || jumlah < 1) {
      return setError("Jumlah minimal 1.");
    }

    const keranjang = bacaKeranjang();
    const sudahAda = keranjang.find((k) => k.id === item.id);
    const jumlahDiKeranjang = sudahAda ? sudahAda.jumlah : 0;

    if (jumlah + jumlahDiKeranjang > item.stok) {
      const sisaBisa = item.stok - jumlahDiKeranjang;
      return setError(
        jumlahDiKeranjang > 0
          ? `Stok ${item.stok}, di keranjang sudah ${jumlahDiKeranjang}. Kamu hanya bisa menambah ${sisaBisa} lagi.`
          : `Jumlah melebihi stok. Stok tersedia ${item.stok}.`,
      );
    }

    if (sudahAda) {
      sudahAda.jumlah += jumlah;
    } else {
      keranjang.push({ id: item.id, jumlah });
    }
    simpanKeranjang(keranjang);

    setError("");
    setBerhasil(true);
  }

  return (
    <form onSubmit={kirim} noValidate className="mt-6 space-y-3 border-t pt-4">
      <h2 className="text-lg font-semibold">Tambah ke Keranjang</h2>
      <label className="block text-sm">
        Jumlah
        <input
          type="number"
          min="1"
          value={jumlah}
          onChange={(e) => setJumlah(Number(e.target.value))}
          className="mt-1 block w-32 rounded border px-3 py-2"
        />
      </label>
      <p>
        Total harga: <b>{rupiah(item.harga * Math.max(jumlah, 0))}</b>
      </p>
      {error && <p className="text-red-600">{error}</p>}
      {berhasil && <p className="text-green-700">Ditambahkan ke keranjang.</p>}
      <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Tambah ke keranjang
      </button>
    </form>
  );
}
