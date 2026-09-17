export type ClassValue = string | number | false | null | undefined

/** Minimal className joiner. Swap for clsx/tailwind-merge if class conflicts get common. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
