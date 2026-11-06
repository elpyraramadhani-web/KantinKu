"use client";
import { useEffect, useState } from "react";
import { menu, rupiah } from "@/data/menu";

import { bacaKeranjang, simpanKeranjang, type ItemKeranjang } from "@/lib/keranjang";

// BARU: bentuk struk dan data riwayat
type Struk = {
  nama: string;
  cara: "ambil" | "antar";
  kelas: string;
  baris: { nama: string; jumlah: number; subtotal: number }[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
};

const KODE_PROMO = "HEMAT10";
const MIN_PROMO = 20000;
const ONGKIR = 2000;

function baca(): ItemKeranjang[] {
  try {
    return JSON.parse(localStorage.getItem("keranjang") ?? "[]");
  } catch {
    return [];
  }
}

// BARU: simpan pesanan ke riwayat (terbaru di depan)
function simpanRiwayat(struk: Struk) {
  let riwayat: unknown[] = [];
  try {
    riwayat = JSON.parse(localStorage.getItem("riwayat") ?? "[]");
  } catch {
    riwayat = [];
  }
  riwayat.unshift({ ...struk, waktu: new Date().toISOString() });
  localStorage.setItem("riwayat", JSON.stringify(riwayat));
}

export default function KeranjangIsi() {
  const [isi, setIsi] = useState<ItemKeranjang[] | null>(null);
  const [kode, setKode] = useState("");
  const [promoAktif, setPromoAktif] = useState(false);
  const [pesanPromo, setPesanPromo] = useState("");
  const [cara, setCara] = useState<"ambil" | "antar">("ambil");
  const [kelas, setKelas] = useState("");
  const [nama, setNama] = useState(""); // BARU
  const [errNama, setErrNama] = useState(""); // BARU
  const [errKelas, setErrKelas] = useState(""); // BARU
  const [struk, setStruk] = useState<Struk | null>(null); // BARU

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsi(bacaKeranjang());
  }, []);

  function simpan(baru: ItemKeranjang[]) {
    setIsi(baru);
    simpanKeranjang(baru);
    }

  function ubah(id: number, selisih: number) {
    if (!isi) return;
    const m = menu.find((x) => x.id === id);
    if (!m) return;
    simpan(
      isi.map((k) => {
        if (k.id !== id) return k;
        const baru = k.jumlah + selisih;
        if (baru < 1 || baru > m.stok) return k;
        return { ...k, jumlah: baru };
      })
    );
  }

  function hapus(id: number) {
    if (!isi) return;
    simpan(isi.filter((k) => k.id !== id));
  }

  if (isi === null) return null;

  const baris = isi.flatMap((k) => {
    const m = menu.find((x) => x.id === k.id);
    return m ? [{ k, m }] : [];
  });

  const subtotal = baris.reduce((total, { k, m }) => total + m.harga * k.jumlah, 0);
  const promoBerlaku = promoAktif && subtotal >= MIN_PROMO;
  const diskon = promoBerlaku ? Math.round(subtotal * 0.1) : 0;
  const ongkir = cara === "antar" ? ONGKIR : 0;
  const total = subtotal - diskon + ongkir;

  // BARU: tampilan struk
  const tampilStruk = struk && (
    <div className="space-y-1 rounded-xl border border-green-600 bg-white p-4 text-slate-900">
      <h2 className="text-lg font-bold">Terima kasih, {struk.nama}!</h2>
      {struk.baris.map((b) => (
        <p key={b.nama}>
          {b.nama} x{b.jumlah} = {rupiah(b.subtotal)}
        </p>
      ))}
      <p className="border-t pt-1">Subtotal: {rupiah(struk.subtotal)}</p>
      {struk.diskon > 0 && <p>Diskon: -{rupiah(struk.diskon)}</p>}
      <p>
        {struk.cara === "antar"
          ? `Ongkir antar ke ${struk.kelas}: ${rupiah(struk.ongkir)}`
          : "Diambil sendiri di kantin"}
      </p>
      <p className="font-bold">Total bayar: {rupiah(struk.total)}</p>
    </div>
  );

  if (baris.length === 0) {
    return (
      <div className="space-y-4">
        {tampilStruk}
        <p className="text-slate-500">Keranjang masih kosong.</p>
      </div>
    );
  }

  function pakai() {
    const masuk = kode.trim().toUpperCase();
    if (masuk !== KODE_PROMO) {
      setPromoAktif(false);
      setPesanPromo("Kode promo tidak dikenal.");
      return;
    }
    if (subtotal < MIN_PROMO) {
      setPromoAktif(false);
      setPesanPromo("Promo HEMAT10 butuh belanja minimal Rp 20.000.");
      return;
    }
    setPromoAktif(true);
    setPesanPromo("Promo HEMAT10 dipakai: diskon 10%.");
  }

  // BARU: kirim pesanan
  function pesan(e: React.FormEvent) {
    e.preventDefault();
    const namaOk = nama.trim().length >= 3;
    const kelasOk = cara === "ambil" || kelas.trim().length >= 3;
    setErrNama(namaOk ? "" : "Nama minimal 3 huruf.");
    setErrKelas(kelasOk ? "" : "Kelas minimal 3 karakter.");
    if (!namaOk || !kelasOk) return;

    const baru: Struk = {
      nama: nama.trim(),
      cara,
      kelas: kelas.trim(),
      baris: baris.map(({ k, m }) => ({
        nama: m.nama,
        jumlah: k.jumlah,
        subtotal: m.harga * k.jumlah,
      })),
      subtotal,
      diskon,
      ongkir,
      total,
    };

    setStruk(baru);
    simpanRiwayat(baru);
    simpan([]); // kosongkan keranjang
    // reset formulir dan promo
    setNama("");
    setKelas("");
    setCara("ambil");
    setKode("");
    setPromoAktif(false);
    setPesanPromo("");
    setErrNama("");
    setErrKelas("");
  }

  const pesanTampil =
    promoAktif && !promoBerlaku
      ? "Promo HEMAT10 butuh belanja minimal Rp 20.000."
      : pesanPromo;

  return (
    <div className="space-y-6">
      {tampilStruk}

      <ul className="space-y-3">
        {baris.map(({ k, m }) => (
          <li
            key={m.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 text-slate-900"
          >
            <div>
              <p className="font-semibold">{m.nama}</p>
              <p className="text-sm text-slate-500">{rupiah(m.harga)} per porsi</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => ubah(m.id, -1)}
                disabled={k.jumlah <= 1}
                className="rounded border px-3 py-1 disabled:opacity-40"
              >
                −
              </button>
              <span className="w-8 text-center">{k.jumlah}</span>
              <button
                onClick={() => ubah(m.id, 1)}
                disabled={k.jumlah >= m.stok}
                className="rounded border px-3 py-1 disabled:opacity-40"
              >
                +
              </button>
            </div>

            <p className="font-medium">{rupiah(m.harga * k.jumlah)}</p>

            <button
              onClick={() => hapus(m.id)}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>

      <div className="space-y-2 rounded-xl border bg-white p-4 text-slate-900">
        <h2 className="font-semibold">Kode promo</h2>
        <div className="flex gap-2">
          <input
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            placeholder="Masukkan kode promo"
            className="rounded border px-3 py-2"
          />
          <button
            onClick={pakai}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Pakai
          </button>
        </div>
        {pesanTampil && (
          <p className={promoBerlaku ? "text-green-700" : "text-red-600"}>
            {pesanTampil}
          </p>
        )}
      </div>

      <div className="space-y-2 rounded-xl border bg-white p-4 text-slate-900">
        <h2 className="font-semibold">Cara ambil</h2>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="cara"
            value="ambil"
            checked={cara === "ambil"}
            onChange={() => setCara("ambil")}
          />
          Ambil sendiri
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="cara"
            value="antar"
            checked={cara === "antar"}
            onChange={() => setCara("antar")}
          />
          Diantar (+Rp 2.000)
        </label>
        {cara === "antar" && (
          <>
            <input
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              placeholder="Kelas"
              className="mt-1 block w-full rounded border px-3 py-2"
            />
            {errKelas && <p className="text-red-600">{errKelas}</p>}
          </>
        )}
      </div>

      <div className="space-y-1 rounded-xl border bg-white p-4 text-slate-900">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span>{rupiah(subtotal)}</span>
        </p>
        {diskon > 0 && (
          <p className="flex justify-between text-green-700">
            <span>Diskon</span>
            <span>-{rupiah(diskon)}</span>
          </p>
        )}
        {cara === "antar" && (
          <p className="flex justify-between">
            <span>Ongkir</span>
            <span>{rupiah(ongkir)}</span>
          </p>
        )}
        <p className="flex justify-between border-t pt-2 text-lg font-bold">
          <span>Total</span>
          <span>{rupiah(total)}</span>
        </p>
      </div>

      {/* BARU: formulir pesan */}
      <form
        onSubmit={pesan}
        className="space-y-3 rounded-xl border bg-white p-4 text-slate-900"
      >
        <h2 className="font-semibold">Pesan sekarang</h2>
        <input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama pemesan"
          className="block w-full rounded border px-3 py-2"
        />
        {errNama && <p className="text-red-600">{errNama}</p>}
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Pesan
        </button>
      </form>
    </div>
  );
}