import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World from Deno with denon !";
});

await app.listen({ port: 8000 });
