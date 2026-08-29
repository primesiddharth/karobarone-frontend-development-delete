import {
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { CommerceShell } from "@/components/commerce/CommerceShell";
import { payments, money } from "@/components/commerce/data";
const cls = (s: string) =>
  s === "Paid" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600";
export default function PaymentsPage() {
  return (
    <CommerceShell title="Payments" eyebrow="Orders & Payments">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total paid</p>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{money(6396)}</p>
            <p className="mt-1 text-xs text-gray-500">2 successful payments</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Refunded</p>
              <RotateCcw className="h-5 w-5 text-gray-500" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{money(3598)}</p>
            <p className="mt-1 text-xs text-gray-500">1 refunded transaction</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Payment methods</p>
              <CreditCard className="h-5 w-5 text-[#5b4ef9]" />
            </div>
            <p className="mt-3 text-2xl font-semibold">3</p>
            <p className="mt-1 text-xs text-gray-500">UPI, cards and banking</p>
          </div>
        </div>
        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold">Payment history</h2>
            <p className="mt-1 text-sm text-gray-500">
              Recent transactions connected to your orders.
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5b4ef9]/10 text-[#5b4ef9]">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{p.id}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {p.order} · {p.date} · {p.method}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-8 sm:justify-end">
                  <div className="text-right">
                    <p className="font-semibold">{money(p.amount)}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${cls(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CommerceShell>
  );
}
