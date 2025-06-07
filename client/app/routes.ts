import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("destination/:slug", "routes/destination.tsx"),
  route("tour/", "routes/tourdetails.tsx"),
  route("admin", "routes/admin/_layout.tsx", [
    // index("routes/admin/dashboard.tsx"),
  ]),
] satisfies RouteConfig;
