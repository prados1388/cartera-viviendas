import { euros } from "../api.js";
import { claseResultado } from "../lib/cifras.js";

export default function BloqueResultado({ titulo, datos }) {
  if (!datos) return null;
  const beneficio = Number(datos.beneficio) || 0;
  return (
    <section className="bloque-resultado">
      <h2>{titulo}</h2>
      <div className="stat-row">
        <article className="card stat">
          <p className="muted">Ingresos</p>
          <p className="stat-num">{euros(datos.ingresos)}</p>
        </article>
        <article className="card stat">
          <p className="muted">Gastos</p>
          <p className="stat-num">{euros(datos.gastos)}</p>
        </article>
        <article className="card stat">
          <p className="muted">{beneficio >= 0 ? "Beneficio" : "Pérdida"}</p>
          <p className={`stat-num ${claseResultado(beneficio)}`}>{euros(beneficio)}</p>
        </article>
      </div>
    </section>
  );
}
