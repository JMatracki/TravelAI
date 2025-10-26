import { Header } from "@/components/layout/Header";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";

export const Layout = () => {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
