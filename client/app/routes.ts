import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("admin", "routes/admin/_layout.tsx", [
    // index("routes/admin/dashboard.tsx"),
  ]),
] satisfies RouteConfig;
