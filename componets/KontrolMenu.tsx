type Props = {
  cari: string;
  onCari: (nilai: string) => void;
  kategori: string;
  onKategori: (nilai: string) => void;
  daftarKategori: string[];
  urut: string;
  onUrut: (nilai: string) => void;
};

export default function KontrolMenu({
  cari, onCari,
  kategori, onKategori, daftarKategori,
  urut, onUrut,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <input
        value={cari}
        onChange={(e) => onCari(e.target.value)}
        placeholder="Cari menu..."
        className="rounded border bg-white px-3 py-2 text-slate-900"
      />
      <select
        value={kategori}
        onChange={(e) => onKategori(e.target.value)}
        className="rounded border bg-white px-3 py-2 text-slate-900"
      >
        {daftarKategori.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <select
        value={urut}
        onChange={(e) => onUrut(e.target.value)}
        className="rounded border bg-white px-3 py-2 text-slate-900"
      >
        <option value="awal">Urutan awal</option>
        <option value="murah">Harga termurah</option>
        <option value="mahal">Harga termahal</option>
        <option value="nama">Nama A-Z</option>
      </select>
    </div>
  );
}