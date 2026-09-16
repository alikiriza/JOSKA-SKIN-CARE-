import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatterCache = new Map<string, Intl.NumberFormat>();
function getCurrencyFormatter(currency = "USD") {
  if (!currencyFormatterCache.has(currency)) {
    currencyFormatterCache.set(currency, new Intl.NumberFormat("en-US", { style: "currency", currency }));
  }
  return currencyFormatterCache.get(currency)!;
}
export function formatNumber(value: number): string { return numberFormatter.format(value); }
export function formatCurrency(value: number, currency = "USD"): string { return getCurrencyFormatter(currency).format(value); }
export function formatCompact(value: number): string { return Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value); }
export function truncate(text: string, length: number): string { return text.length > length ? text.slice(0, length) + "…" : text; }
export function getInitials(name: string): string { return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2); }
export function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }
