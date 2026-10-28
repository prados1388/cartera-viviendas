import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setSesion } from "../api.js";
import CampoClave from "../components/CampoClave.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: { email, password },
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
        <h1>Entrar</h1>
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
        <CampoClave value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="error">{error}</p> : null}
        <button className="btn full" type="submit" disabled={cargando}>
          {cargando ? "Entrando…" : "Entrar"}
        </button>
        <p className="muted">
          ¿Aún no tienes cuenta? <Link to="/registro">Prueba 30 días gratis</Link>
        </p>
      </form>
    </div>
  );
}
