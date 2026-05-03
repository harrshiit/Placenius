import { currentUser } from "@clerk/nextjs/server";

export const ADMIN_EMAIL = "harshitkum188@gmail.com";

export function isAdminEmail(email) {
  return (email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export async function getCurrentUserAdminState() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;

  return {
    user,
    email,
    isAdmin: isAdminEmail(email),
  };
}
