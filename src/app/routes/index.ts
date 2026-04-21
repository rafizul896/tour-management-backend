import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.route";

interface IModuleRoutes {
  path: string;
  route: Router;
}

export const router = Router();

const moduleRoutes: IModuleRoutes[] = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/division",
    route: DivisionRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
