import { euros } from "../api.js";
import { claseResultado } from "../lib/cifras.js";

export default function BloqueResultado({ titulo, datos }) {
  if (!datos) return null;
  const beneficio = Number(datos.beneficio) || 0;
  return (
    <section className="bloque-resultado">
      <h2>{titulo}</h2>
      <div className="cifras-row">
        <div className="cifra">
          <span>Ingresos</span>
          <strong>{euros(datos.ingresos)}</strong>
        </div>
        <div className="cifra">
          <span>Gastos</span>
          <strong>{euros(datos.gastos)}</strong>
        </div>
        <div className={`cifra ${claseResultado(beneficio)}`}>
          <span>{beneficio >= 0 ? "Beneficio" : "Pérdida"}</span>
          <strong>{euros(beneficio)}</strong>
        </div>
      </div>
    </section>
  );
}
