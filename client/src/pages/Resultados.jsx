import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, euros } from "../api.js";
import BloqueResultado from "../components/BloqueResultado.jsx";
import { MESES, aniosDisponibles, claseResultado } from "../lib/cifras.js";

export default function Resultados() {
  const ahora = new Date();
  const [anio, setAnio] = useState(ahora.getFullYear());
  const [mes, setMes] = useState(ahora.getMonth() + 1);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    api(`/api/resultados?anio=${anio}&mes=${mes}`)
      .then((res) => setDatos(res.data))
      .catch((err) => setError(err.message));
  }, [anio, mes]);

  const maxBarra = useMemo(() => {
    if (!datos) return 1;
    const vals = datos.conjunto.porMes.flatMap((m) => [m.ingresos, m.gastos]);
    return Math.max(1, ...vals);
  }, [datos]);

  return (
    <div>
      <header className="page-head">
        <div>
          <p className="eyebrow">Control</p>
          <h1>Beneficios y pérdidas</h1>
          <p className="muted">
            Ingresos según la renta de cada contrato vigente. Gastos, los que hayas apuntado en
            cada vivienda.
          </p>
        </div>
        <div className="filtros">
          <label>
            Mes
            <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
              {MESES.map((nombre, i) => (
                <option key={nombre} value={i + 1}>
                  {nombre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Año
            <select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
              {aniosDisponibles().map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}
      {!datos ? (
        <p className="muted">Calculando…</p>
      ) : (
        <>
          <div className="cifras-duo">
            <BloqueResultado titulo={`${MESES[mes - 1]} · toda la cartera`} datos={datos.conjunto.mes} />
            <BloqueResultado titulo={`${anio} · toda la cartera`} datos={datos.conjunto.anio} />
          </div>

          <section className="card">
            <h2>Año {anio}, mes a mes</h2>
            <div className="bars" aria-hidden="true">
              {datos.conjunto.porMes.map((m) => (
                <div key={m.mes} className="bar-col">
                  <div
                    className="bar in"
                    style={{ height: `${(m.ingresos / maxBarra) * 100}%` }}
                    title={`Ingresos ${euros(m.ingresos)}`}
                  />
                  <div
                    className="bar out"
                    style={{ height: `${(m.gastos / maxBarra) * 100}%` }}
                    title={`Gastos ${euros(m.gastos)}`}
                  />
                  <span>{MESES[m.mes - 1].slice(0, 3)}</span>
                </div>
              ))}
            </div>
            <p className="muted small leyenda">
              <span className="dot in" /> Ingresos
              <span className="dot out" /> Gastos
            </p>
          </section>

          <section className="card tabla-wrap">
            <h2>Por vivienda</h2>
            {datos.viviendas.length === 0 ? (
              <p className="muted">
                Aún no hay viviendas. <Link to="/viviendas">Añade la primera</Link>.
              </p>
            ) : (
              <table className="tabla-res">
                <thead>
                  <tr>
                    <th>Vivienda</th>
                    <th>Ing. mes</th>
                    <th>Gasto mes</th>
                    <th>Resultado mes</th>
                    <th>Ing. año</th>
                    <th>Gasto año</th>
                    <th>Resultado año</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.viviendas.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <Link to={`/viviendas/${v.id}`}>
                          {v.alias}
                          {v.ciudad ? ` · ${v.ciudad}` : ""}
                        </Link>
                      </td>
                      <td>{euros(v.mes.ingresos)}</td>
                      <td>{euros(v.mes.gastos)}</td>
                      <td className={claseResultado(v.mes.beneficio)}>{euros(v.mes.beneficio)}</td>
                      <td>{euros(v.anio.ingresos)}</td>
                      <td>{euros(v.anio.gastos)}</td>
                      <td className={claseResultado(v.anio.beneficio)}>{euros(v.anio.beneficio)}</td>
                    </tr>
                  ))}
                  <tr className="total">
                    <td>Conjunto</td>
                    <td>{euros(datos.conjunto.mes.ingresos)}</td>
                    <td>{euros(datos.conjunto.mes.gastos)}</td>
                    <td className={claseResultado(datos.conjunto.mes.beneficio)}>
                      {euros(datos.conjunto.mes.beneficio)}
                    </td>
                    <td>{euros(datos.conjunto.anio.ingresos)}</td>
                    <td>{euros(datos.conjunto.anio.gastos)}</td>
                    <td className={claseResultado(datos.conjunto.anio.beneficio)}>
                      {euros(datos.conjunto.anio.beneficio)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}
