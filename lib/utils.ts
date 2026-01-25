import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Return one of a small set of avatar image URLs based on a seed (user id/name)
export function getAvatarUrlForSeed(seed: string | number) {
  const seeds = [
    "avatar-1",
    "avatar-2",
    "avatar-3",
    "avatar-4",
    "avatar-5",
  ];
  const s = String(seed || "");
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % seeds.length;
  // Use DiceBear pixel-art PNG avatars for consistent placeholders
  return `https://api.dicebear.com/6.x/pixel-art/png?seed=${seeds[idx]}&size=128`;
}
