import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (username === "test" && password === "123456") {
    cookies.set("session", JSON.stringify({ username }), {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });
    return redirect("/");
  }

  return redirect("/login?error=1");
};
