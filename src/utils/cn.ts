import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Function to combine and merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}