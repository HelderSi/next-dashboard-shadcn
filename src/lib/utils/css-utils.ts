// lib/utils/index.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This is a simple utility function that merges class names together
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}