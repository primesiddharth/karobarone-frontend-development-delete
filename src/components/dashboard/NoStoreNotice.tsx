import Link from "next/link";
import { Store } from "lucide-react";

export function NoStoreNotice() {
  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="max-w-lg mx-auto text-center bg-white border border-slate-200 rounded-2xl p-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#5b4ef9]/10 flex items-center justify-center mb-4">
          <Store className="w-6 h-6 text-[#5b4ef9]" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">No store yet</h2>
        <p className="text-slate-500 text-sm mt-2">
          Finish the store setup questionnaire first — this page needs a store to work with.
        </p>
        <Link
          href="/questionaree"
          className="inline-flex items-center justify-center mt-6 rounded-lg bg-[#5b4ef9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a3ee0]"
        >
          Complete store setup
        </Link>
      </div>
    </div>
  );
}
