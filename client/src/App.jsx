import { Navigate, Route, Routes } from "react-router-dom";
import { getToken } from "./api.js";
import Layout from "./components/Layout.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Panel from "./pages/Panel.jsx";
import Viviendas from "./pages/Viviendas.jsx";
import Vivienda from "./pages/Vivienda.jsx";
import Resultados from "./pages/Resultados.jsx";

function Privada({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route
        element={
          <Privada>
            <Layout />
          </Privada>
        }
      >
        <Route path="/panel" element={<Panel />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/viviendas" element={<Viviendas />} />
        <Route path="/viviendas/:id" element={<Vivienda />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
