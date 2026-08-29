"use client";
import Link from "next/link";
import { Minus, Plus, Trash2, Heart, ShieldCheck } from "lucide-react";
import { CommerceShell } from "@/components/commerce/CommerceShell";
import { products, money } from "@/components/commerce/data";
import { useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState(products);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 3000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <CommerceShell title="Cart" eyebrow="Orders & Payments">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[1fr_380px]">
        <section className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="font-semibold">Your cart</h2>
              <p className="text-sm text-gray-500">
                {items.length} products ready for checkout
              </p>
            </div>
            <span className="rounded-full bg-[#5b4ef9]/10 px-3 py-1 text-xs font-semibold text-[#5b4ef9]">
              {items.reduce((s, i) => s + i.qty, 0)} items
            </span>
          </div>
          {items.length ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-gray-100 p-5 last:border-0"
              >
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-400">
                  {item.image}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.variant}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {money(item.price * item.qty)}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        className="p-2"
                        onClick={() =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id
                                ? { ...i, qty: Math.max(1, i.qty - 1) }
                                : i,
                            ),
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.qty}
                      </span>
                      <button
                        className="p-2"
                        onClick={() =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
                            ),
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex gap-4">
                      <button className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#5b4ef9]">
                        <Heart className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        onClick={() =>
                          setItems(items.filter((i) => i.id !== item.id))
                        }
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-16 text-center">
              <p className="font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-gray-500">
                Add products to continue.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex rounded-lg bg-[#5b4ef9] px-5 py-2.5 text-sm font-medium text-white"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </section>
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 lg:sticky lg:top-28">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping ? money(shipping) : "Free"}</span>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#5b4ef9] px-5 py-3 text-sm font-medium text-white hover:bg-[#4a3ee0]"
          >
            Proceed to Checkout
          </Link>
          <div className="mt-5 flex gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#5b4ef9]" />
            Secure checkout with protected payment processing.
          </div>
        </aside>
      </div>
    </CommerceShell>
  );
}
