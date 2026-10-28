import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, fechaCorta, getUsuario } from "../api.js";
import BloqueResultado from "../components/BloqueResultado.jsx";
import { MESES } from "../lib/cifras.js";

export default function Panel() {
  const usuario = getUsuario();
  const [datos, setDatos] = useState(null);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState("");
  const ahora = new Date();

  useEffect(() => {
    Promise.all([
      api("/api/panel"),
      api(`/api/resultados?anio=${ahora.getFullYear()}&mes=${ahora.getMonth() + 1}`),
    ])
      .then(([panel, res]) => {
        setDatos(panel.data);
        setResultados(res.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <header className="page-head">
        <div>
          <p className="eyebrow">Resumen</p>
          <h1>Hola, {usuario?.nombre?.split(" ")[0] || "inversión"}</h1>
        </div>
        <Link className="btn" to="/viviendas">
          Añadir vivienda
        </Link>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <div className="stat-row">
        <article className="card stat">
          <p className="muted">Viviendas</p>
          <p className="stat-num">{datos ? datos.viviendas : "…"}</p>
        </article>
        <article className="card stat">
          <p className="muted">Avisos en 60 días</p>
          <p className="stat-num">{datos ? datos.alarmas.length : "…"}</p>
        </article>
        <article className="card stat">
          <p className="muted">Contratos que vencen</p>
          <p className="stat-num">{datos ? datos.contratos.length : "…"}</p>
        </article>
      </div>

      {resultados ? (
        <>
          <div className="cifras-duo">
            <BloqueResultado
              titulo={`${MESES[resultados.mes - 1]} · cartera`}
              datos={resultados.conjunto.mes}
            />
            <BloqueResultado titulo={`${resultados.anio} · cartera`} datos={resultados.conjunto.anio} />
          </div>
          <p className="muted ver-desglose">
            <Link to="/resultados">Ver desglose por vivienda →</Link>
          </p>
        </>
      ) : null}

      <div className="split">
        <section className="card">
          <h2>Revisiones y alarmas</h2>
          {!datos ? (
            <p className="muted">Cargando…</p>
          ) : datos.alarmas.length === 0 ? (
            <p className="muted">No hay avisos próximos. Añádelos en cada ficha.</p>
          ) : (
            <ul className="lista">
              {datos.alarmas.map((a) => (
                <li key={a._id}>
                  <Link to={`/viviendas/${a.vivienda?._id || a.vivienda}`}>
                    <strong>{a.titulo}</strong>
                    <span>
                      {a.vivienda?.alias} · {fechaCorta(a.fecha)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card">
          <h2>Contratos que acaban</h2>
          {!datos ? (
            <p className="muted">Cargando…</p>
          ) : datos.contratos.length === 0 ? (
            <p className="muted">Ningún contrato vence en los próximos 60 días.</p>
          ) : (
            <ul className="lista">
              {datos.contratos.map((c) => (
                <li key={c._id}>
                  <Link to={`/viviendas/${c.vivienda?._id || c.vivienda}`}>
                    <strong>{c.inquilino}</strong>
                    <span>
                      {c.vivienda?.alias} · hasta {fechaCorta(c.fechaFin)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
