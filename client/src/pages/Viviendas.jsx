import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

const tipos = [
  { value: "piso", label: "Piso" },
  { value: "casa", label: "Casa" },
  { value: "local", label: "Local" },
  { value: "otro", label: "Otro" },
];

const vacio = { alias: "", direccion: "", ciudad: "", tipo: "piso", notas: "" };

export default function Viviendas() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(vacio);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    const res = await api("/api/viviendas");
    setLista(res.data);
  }

  useEffect(() => {
    cargar().catch((err) => setError(err.message));
  }, []);

  function campo(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function crear(e) {
    e.preventDefault();
    setError("");
    setGuardando(true);
    try {
      await api("/api/viviendas", { method: "POST", body: form });
      setForm(vacio);
      await cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      <header className="page-head">
        <div>
          <p className="eyebrow">Cartera</p>
          <h1>Viviendas</h1>
        </div>
      </header>

      <div className="split">
        <form className="card" onSubmit={crear}>
          <h2>Añadir inmueble</h2>
          <p className="muted small">
            Con alias y dirección basta. El resto (inversión, seguros, escrituras…) se completa en la
            ficha.
          </p>
          <label>
            Alias (ej. Triana 12)
            <input name="alias" value={form.alias} onChange={campo} required />
          </label>
          <label>
            Dirección
            <input name="direccion" value={form.direccion} onChange={campo} required />
          </label>
          <label>
            Ciudad
            <input name="ciudad" value={form.ciudad} onChange={campo} />
          </label>
          <label>
            Tipo
            <select name="tipo" value={form.tipo} onChange={campo}>
              {tipos.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Notas
            <textarea name="notas" value={form.notas} onChange={campo} rows={3} />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn" type="submit" disabled={guardando}>
            {guardando ? "Guardando…" : "Guardar vivienda"}
          </button>
        </form>

        <div className="vivienda-grid">
          {lista.length === 0 ? (
            <p className="muted">Aún no hay viviendas. Añade la primera a la izquierda.</p>
          ) : (
            lista.map((v) => (
              <Link key={v._id} className="card vivienda-card" to={`/viviendas/${v._id}`}>
                <p className="eyebrow">{v.tipo}</p>
                <h2>{v.alias}</h2>
                <p className="muted">
                  {v.direccion}
                  {v.ciudad ? ` · ${v.ciudad}` : ""}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
