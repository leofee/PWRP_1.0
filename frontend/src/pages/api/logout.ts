import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.set("session", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });
  return redirect("/login");
};
