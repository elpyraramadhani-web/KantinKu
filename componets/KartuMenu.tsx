import Link from "next/link";
import { rupiah, type Menu } from "@/data/menu";
import TombolFavorit from "@/componets/TombolFavorit";

export default function KartuMenu({ item }: { item: Menu }) {
  const habis = item.stok === 0;

 return (
    <div
      className={
        habis
          ? "rounded-xl border bg-slate-100 p-4 text-slate-400 shadow-sm"
          : "rounded-xl border bg-white p-4 text-slate-900 shadow-sm"
      }
    >
      <span
        className={
          habis
            ? "rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-500"
            : "rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
        }
      >
        {item.kategori}
      </span>
      <h3 className="mt-2 text-lg font-semibold">{item.nama}</h3>
      <p className="mt-1 font-medium">{rupiah(item.harga)}</p>
      <p
        className={
          habis ? "text-sm font-bold text-red-400" : "text-sm text-green-700"
        }
      >
        {habis ? "Habis" : `Stok ${item.stok}`}
      </p>

            <div className="flex flex-wrap items-center gap-2">
        {habis ? (
          <button
            disabled
            className="mt-3 inline-block cursor-not-allowed rounded bg-slate-300 px-3 py-1.5 text-sm text-slate-500"
          >
            Habis
          </button>
        ) : (
          <Link
            href={`/menu/${item.id}`}
            className="mt-3 inline-block rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Lihat detail
          </Link>
        )}
        <TombolFavorit id={item.id} />
      </div>
    </div>
  );
}