import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("destination/:slug", "routes/destination.tsx"),
  route("tour/", "routes/tourdetails.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("unauthorized", "routes/unauthorized.tsx"),
  route("admin", "routes/admin/_layout.tsx", [
    route("dashboard", "routes/admin/dashboard.tsx"),
  ]),
] satisfies RouteConfig;
