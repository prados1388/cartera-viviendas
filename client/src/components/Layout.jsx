import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearSesion, getUsuario } from "../api.js";
import InstalarApp from "./InstalarApp.jsx";

export default function Layout() {
  const navigate = useNavigate();
  const usuario = getUsuario();

  function salir() {
    clearSesion();
    navigate("/");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <p className="brand-mark">Cartera</p>
        <p className="brand-sub">Viviendas en alquiler</p>
        <nav>
          <NavLink to="/panel">Panel</NavLink>
          <NavLink to="/resultados">Resultados</NavLink>
          <NavLink to="/viviendas">Viviendas</NavLink>
        </nav>
        <div className="sidebar-foot">
          <p className="muted small">{usuario?.nombre}</p>
          <p className="plan-pill">{usuario?.plan === "prueba" ? "Prueba 30 días" : "Plan activa"}</p>
          <InstalarApp />
          <button type="button" className="btn ghost full" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
