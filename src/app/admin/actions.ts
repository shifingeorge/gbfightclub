"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "gb_admin";

export async function isAdmin(): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === expected;
}

export async function login(formData: FormData) {
  const expected = process.env.ADMIN_PASSWORD;
  const given = String(formData.get("password") ?? "");
  if (expected && given === expected) {
    const store = await cookies();
    store.set(COOKIE, given, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
      path: "/admin",
    });
  }
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/admin");
}
