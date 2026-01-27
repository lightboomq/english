import { Outlet } from "react-router-dom";
import s from "../styles/00_layout.module.css";

export const Layout = () => {
  return (
    <main className={s.wrapper}>
      <Outlet />
    </main>
  );
};
