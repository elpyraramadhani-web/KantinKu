import Link from "next/link";

export default function Beranda() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold">Selamat Datang di Kantin Sekolah</h1>
      <p className="max-w-md text-lg text-slate-500">
        Lihat daftar menu, pilih favoritmu, dan nikmati hidangan terbaik hari ini.
      </p>
      <Link
        href="/menu"
        className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Lihat Menu
      </Link>
    </main>
  );
}