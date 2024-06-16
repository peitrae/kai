import { defineRoutes } from "@remix-run/dev/dist/config/routes";

const routes = defineRoutes((route) => {
  route("/", "./modules/main/pages/Index/Index.tsx");
  route("/grammar", "./modules/grammar/pages/Grammar/Grammar.tsx");
});

export default routes;
