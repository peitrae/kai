import { defineRoutes } from "@remix-run/dev/dist/config/routes";

const routes = defineRoutes((route) => {
  route("/", "./modules/main/pages/Index/Index.tsx");
});

export default routes;
