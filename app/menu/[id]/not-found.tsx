import Link from "next/link";

export default function EventTidakAda() {
    return (
        <div className="py-16 text-center">
            <h1 className= "text-2xl font-bold">Menu Tidak Ditemukan</h1>
            <p className="mt-2 text-slate-600">Mungkin menu ini sudah dihapus atau alamatnya salah</p>
            <Link href="/events" className="mt-4 inline-block text-blue-600 hover:underline">Kembali ke Menu</Link>
        </div>
    );
}