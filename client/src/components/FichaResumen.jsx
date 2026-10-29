import { api, bajarArchivo, euros, fechaCorta, porcentaje } from "../api.js";

function Dato({ etiqueta, valor }) {
  if (valor == null || valor === "" || valor === "—") return null;
  return (
    <div className="dato">
      <span>{etiqueta}</span>
      <strong>{valor}</strong>
    </div>
  );
}

function Seguro({ titulo, s }) {
  if (!s || (!s.compania && !s.poliza && !s.vencimiento)) return null;
  return (
    <div className="dato-grupo">
      <h3>{titulo}</h3>
      <div className="datos-grid">
        <Dato etiqueta="Compañía" valor={s.compania} />
        <Dato etiqueta="Póliza" valor={s.poliza} />
        <Dato etiqueta="Vencimiento" valor={fechaCorta(s.vencimiento)} />
        <Dato etiqueta="Importe" valor={s.importe != null ? euros(s.importe) : null} />
      </div>
    </div>
  );
}

export default function FichaResumen({ vivienda, archivos, viviendaId, onError, recargar }) {
  const c = vivienda.cifras || {};
  const escrituras = (archivos || []).filter((a) => a.tipo === "escritura");
  const planos = (archivos || []).filter((a) => a.tipo === "plano");

  async function quitar(archivo) {
    if (!confirm(`¿Quitar ${archivo.nombre}?`)) return;
    try {
      await api(`/api/viviendas/${viviendaId}/archivos/${archivo._id}`, { method: "DELETE" });
      await recargar();
    } catch (err) {
      onError(err.message);
    }
  }

  const vacia =
    !vivienda.descripcion &&
    !vivienda.referenciaCatastral &&
    vivienda.metros == null &&
    vivienda.anioConstruccion == null &&
    vivienda.anioReforma == null &&
    !vivienda.fechaCompra &&
    !vivienda.eficienciaEnergetica &&
    vivienda.precioCompra == null &&
    vivienda.rentaMensual == null &&
    vivienda.valoracionActual == null &&
    vivienda.deudaActual == null &&
    !vivienda.datosFiscales &&
    !(vivienda.contactos || []).length &&
    escrituras.length === 0 &&
    planos.length === 0;

  if (vacia) {
    return (
      <p className="muted">
        Pulsa Editar para completar inversión, seguros, escrituras, planos y contactos.
      </p>
    );
  }

  return (
    <div className="ficha-resumen">
      <div className="dato-grupo">
        <h3>Inmueble</h3>
        <div className="datos-grid">
          <Dato etiqueta="Descripción" valor={vivienda.descripcion} />
          <Dato etiqueta="Referencia catastral" valor={vivienda.referenciaCatastral} />
          <Dato etiqueta="Metros" valor={vivienda.metros ? `${vivienda.metros} m²` : null} />
          <Dato etiqueta="Año construcción" valor={vivienda.anioConstruccion} />
          <Dato etiqueta="Año reforma" valor={vivienda.anioReforma} />
          <Dato etiqueta="Fecha de compra" valor={fechaCorta(vivienda.fechaCompra)} />
          <Dato etiqueta="Eficiencia energética" valor={vivienda.eficienciaEnergetica} />
        </div>
      </div>

      <div className="dato-grupo">
        <h3>Inversión</h3>
        <div className="datos-grid">
          <Dato etiqueta="Precio de compra" valor={euros(vivienda.precioCompra)} />
          <Dato etiqueta="Otros gastos compraventa" valor={euros(vivienda.otrosGastosCompraventa)} />
          <Dato etiqueta="Inversión total" valor={euros(c.inversionTotal)} />
          <Dato etiqueta="Renta mensual" valor={euros(c.rentaUsada || vivienda.rentaMensual)} />
          <Dato etiqueta="Rentabilidad" valor={porcentaje(c.rentabilidad)} />
          <Dato etiqueta="Valoración actual" valor={euros(vivienda.valoracionActual)} />
          <Dato etiqueta="Deuda actual" valor={euros(vivienda.deudaActual)} />
          <Dato etiqueta="Equity" valor={euros(c.equity)} />
        </div>
      </div>

      <Seguro titulo="Seguro de hogar" s={vivienda.seguroHogar} />
      <Seguro titulo="Seguro de impago" s={vivienda.seguroImpago} />

      {vivienda.datosFiscales ? (
        <div className="dato-grupo">
          <h3>Datos fiscales</h3>
          <p className="dato-texto">{vivienda.datosFiscales}</p>
        </div>
      ) : null}

      {vivienda.contactos?.filter((x) => x.nombre || x.telefono).length ? (
        <div className="dato-grupo">
          <h3>Contactos</h3>
          <div className="datos-grid">
            {vivienda.contactos.map((x, i) => (
              <Dato
                key={x._id || i}
                etiqueta={x.rol || "Contacto"}
                valor={[x.nombre, x.telefono, x.email].filter(Boolean).join(" · ")}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="dato-grupo">
        <h3>Documentos</h3>
        <ListaArchivos
          titulo="Escrituras"
          items={escrituras}
          viviendaId={viviendaId}
          onQuitar={quitar}
          onError={onError}
        />
        <ListaArchivos
          titulo="Planos"
          items={planos}
          viviendaId={viviendaId}
          onQuitar={quitar}
          onError={onError}
        />
      </div>
    </div>
  );
}

function ListaArchivos({ titulo, items, viviendaId, onQuitar, onError }) {
  return (
    <div className="archivos-bloque">
      <p className="muted small">{titulo}</p>
      {items.length === 0 ? (
        <p className="muted">Sin archivos. Añádelos al editar.</p>
      ) : (
        <ul className="archivos-lista">
          {items.map((a) => (
            <li key={a._id}>
              <button
                type="button"
                className="linkish"
                onClick={() => bajarArchivo(viviendaId, a._id, a.nombre).catch((e) => onError(e.message))}
              >
                {a.nombre}
              </button>
              <button type="button" className="btn ghost tiny" onClick={() => onQuitar(a)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
