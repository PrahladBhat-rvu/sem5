import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function inviteCode() { return crypto.randomUUID().replaceAll("-", "").slice(0, 10); }