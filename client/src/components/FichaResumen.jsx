import { api, bajarArchivo, euros, fechaCorta, porcentaje } from "../api.js";

function Dato({ etiqueta, valor }) {
  const texto = valor == null || valor === "" ? "—" : valor;
  return (
    <div className="dato">
      <span>{etiqueta}</span>
      <strong className={texto === "—" ? "muted" : undefined}>{texto}</strong>
    </div>
  );
}

function Seguro({ titulo, s = {} }) {
  return (
    <div className="dato-grupo">
      <h3>{titulo}</h3>
      <div className="datos-grid">
        <Dato etiqueta="Compañía" valor={s.compania} />
        <Dato etiqueta="Póliza" valor={s.poliza} />
        <Dato etiqueta="Vencimiento" valor={s.vencimiento ? fechaCorta(s.vencimiento) : ""} />
        <Dato etiqueta="Importe" valor={s.importe != null && s.importe !== "" ? euros(s.importe) : ""} />
      </div>
    </div>
  );
}

export default function FichaResumen({ vivienda, archivos, viviendaId, onError, recargar }) {
  const c = vivienda.cifras || {};
  const escrituras = (archivos || []).filter((a) => a.tipo === "escritura");
  const planos = (archivos || []).filter((a) => a.tipo === "plano");
  const contactos = vivienda.contactos || [];

  async function quitar(archivo) {
    if (!confirm(`¿Quitar ${archivo.nombre}?`)) return;
    try {
      await api(`/api/viviendas/${viviendaId}/archivos/${archivo._id}`, { method: "DELETE" });
      await recargar();
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <div className="ficha-resumen">
      <div className="dato-grupo">
        <h3>Inmueble</h3>
        <div className="datos-grid">
          <Dato etiqueta="Alias" valor={vivienda.alias} />
          <Dato etiqueta="Descripción" valor={vivienda.descripcion} />
          <Dato etiqueta="Dirección" valor={vivienda.direccion} />
          <Dato etiqueta="Ciudad" valor={vivienda.ciudad} />
          <Dato etiqueta="Referencia catastral" valor={vivienda.referenciaCatastral} />
          <Dato etiqueta="Metros" valor={vivienda.metros != null ? `${vivienda.metros} m²` : ""} />
          <Dato etiqueta="Año construcción" valor={vivienda.anioConstruccion} />
          <Dato etiqueta="Año reforma" valor={vivienda.anioReforma} />
          <Dato etiqueta="Fecha de compra" valor={vivienda.fechaCompra ? fechaCorta(vivienda.fechaCompra) : ""} />
          <Dato etiqueta="Eficiencia energética" valor={vivienda.eficienciaEnergetica} />
        </div>
      </div>

      <div className="dato-grupo">
        <h3>Inversión</h3>
        <div className="datos-grid">
          <Dato etiqueta="Precio de compra" valor={euros(vivienda.precioCompra)} />
          <Dato etiqueta="Otros gastos compraventa" valor={euros(vivienda.otrosGastosCompraventa)} />
          <Dato etiqueta="Inversión total" valor={euros(c.inversionTotal)} />
          <Dato etiqueta="Renta mensual" valor={euros(vivienda.rentaMensual ?? c.rentaUsada)} />
          <Dato etiqueta="Rentabilidad" valor={porcentaje(c.rentabilidad)} />
          <Dato etiqueta="Valoración actual" valor={euros(vivienda.valoracionActual)} />
          <Dato etiqueta="Deuda actual" valor={euros(vivienda.deudaActual)} />
          <Dato etiqueta="Equity" valor={euros(c.equity)} />
        </div>
      </div>

      <Seguro titulo="Seguro de hogar" s={vivienda.seguroHogar} />
      <Seguro titulo="Seguro de impago" s={vivienda.seguroImpago} />

      <div className="dato-grupo">
        <h3>Datos fiscales</h3>
        {vivienda.datosFiscales ? (
          <p className="dato-texto">{vivienda.datosFiscales}</p>
        ) : (
          <p className="muted">Sin datos fiscales.</p>
        )}
      </div>

      <div className="dato-grupo">
        <h3>Contactos</h3>
        {contactos.filter((x) => x.nombre || x.telefono || x.email).length ? (
          <div className="datos-grid">
            {contactos.map((x, i) => (
              <Dato
                key={x._id || i}
                etiqueta={x.rol || "Contacto"}
                valor={[x.nombre, x.telefono, x.email].filter(Boolean).join(" · ")}
              />
            ))}
          </div>
        ) : (
          <p className="muted">Sin contactos.</p>
        )}
      </div>

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
        <p className="muted">Sin archivos. Añádelos al editar la ficha.</p>
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
