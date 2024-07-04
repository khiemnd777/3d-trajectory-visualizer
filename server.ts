import { serve } from "bun";

serve({
  fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    if (path === "/") {
      path = "/index.html";
    }

    try {
      const file = Bun.file("." + path);
      return new Response(file);
    } catch {
      return new Response("File not found", { status: 404 });
    }
  },
  port: 3000,
});

console.log("Server running on http://localhost:3000");
