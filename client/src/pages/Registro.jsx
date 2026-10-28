import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setSesion } from "../api.js";
import CampoClave from "../components/CampoClave.jsx";
import { DIAS_PRUEBA, PRECIO_ANUAL, PRECIO_MENSUAL } from "../lib/planes.js";

export default function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const data = await api("/api/auth/registro", {
        method: "POST",
        body: { nombre, email, password },
      });
      setSesion(data.token, data.usuario);
      navigate("/panel");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={enviar}>
        <p className="brand-mark">Cartera</p>
        <h1>Crear cuenta</h1>
        <p className="muted">
          {DIAS_PRUEBA} días de prueba. Luego {PRECIO_MENSUAL} €/mes o {PRECIO_ANUAL} €/año.
        </p>
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <CampoClave
          etiqueta="Contraseña (mín. 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
        />
        {error ? <p className="error">{error}</p> : null}
        <button className="btn full" type="submit" disabled={cargando}>
          {cargando ? "Creando…" : "Empezar"}
        </button>
        <p className="muted">
          ¿Ya tienes cuenta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
