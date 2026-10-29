import { api, bajarArchivo, euros, porcentaje } from "../api.js";
import { inversionEnVivo } from "../lib/viviendaForm.js";

const tiposVivienda = [
  { value: "piso", label: "Piso" },
  { value: "casa", label: "Casa" },
  { value: "local", label: "Local" },
  { value: "otro", label: "Otro" },
];

const letras = ["", "A", "B", "C", "D", "E", "F", "G"];

export default function FichaEditor({
  perfil,
  setPerfil,
  onSubmit,
  onCancelar,
  guardando,
  viviendaId,
  archivos,
  recargar,
  onError,
}) {
  const cifras = inversionEnVivo(perfil);

  function setCampo(campo, valor) {
    setPerfil((p) => ({ ...p, [campo]: valor }));
  }

  function setSeguro(clave, campo, valor) {
    setPerfil((p) => ({ ...p, [clave]: { ...p[clave], [campo]: valor } }));
  }

  function setContacto(i, campo, valor) {
    setPerfil((p) => {
      const contactos = p.contactos.map((c, idx) => (idx === i ? { ...c, [campo]: valor } : c));
      return { ...p, contactos };
    });
  }

  async function subir(tipo, file) {
    if (!file) return;
    const fd = new FormData();
    fd.append("tipo", tipo);
    fd.append("archivo", file);
    try {
      await api(`/api/viviendas/${viviendaId}/archivos`, { method: "POST", body: fd });
      await recargar();
    } catch (err) {
      onError(err.message);
    }
  }

  async function quitarArchivo(archivo) {
    if (!confirm(`¿Quitar ${archivo.nombre}?`)) return;
    try {
      await api(`/api/viviendas/${viviendaId}/archivos/${archivo._id}`, { method: "DELETE" });
      await recargar();
    } catch (err) {
      onError(err.message);
    }
  }

  const escrituras = (archivos || []).filter((a) => a.tipo === "escritura");
  const planos = (archivos || []).filter((a) => a.tipo === "plano");

  return (
    <form className="card ficha-editor" onSubmit={onSubmit}>
      <h2>Editar vivienda</h2>

      <div className="form-grid">
        <div>
          <h3>Inmueble</h3>
          <label>
            Alias
            <input value={perfil.alias} onChange={(e) => setCampo("alias", e.target.value)} required />
          </label>
          <label>
            Descripción
            <textarea
              value={perfil.descripcion}
              onChange={(e) => setCampo("descripcion", e.target.value)}
              rows={3}
            />
          </label>
          <label>
            Dirección
            <input
              value={perfil.direccion}
              onChange={(e) => setCampo("direccion", e.target.value)}
              required
            />
          </label>
          <label>
            Ciudad
            <input value={perfil.ciudad} onChange={(e) => setCampo("ciudad", e.target.value)} />
          </label>
          <label>
            Referencia catastral
            <input
              value={perfil.referenciaCatastral}
              onChange={(e) => setCampo("referenciaCatastral", e.target.value)}
            />
          </label>
          <label>
            Metros
            <input
              type="number"
              step="0.01"
              value={perfil.metros}
              onChange={(e) => setCampo("metros", e.target.value)}
            />
          </label>
          <label>
            Tipo
            <select value={perfil.tipo} onChange={(e) => setCampo("tipo", e.target.value)}>
              {tiposVivienda.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Eficiencia energética
            <select
              value={perfil.eficienciaEnergetica}
              onChange={(e) => setCampo("eficienciaEnergetica", e.target.value)}
            >
              {letras.map((l) => (
                <option key={l || "none"} value={l}>
                  {l || "Sin indicar"}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <h3>Fechas e inversión</h3>
          <label>
            Año construcción
            <input
              type="number"
              value={perfil.anioConstruccion}
              onChange={(e) => setCampo("anioConstruccion", e.target.value)}
            />
          </label>
          <label>
            Año reforma
            <input
              type="number"
              value={perfil.anioReforma}
              onChange={(e) => setCampo("anioReforma", e.target.value)}
            />
          </label>
          <label>
            Fecha de compra
            <input
              type="date"
              value={perfil.fechaCompra}
              onChange={(e) => setCampo("fechaCompra", e.target.value)}
            />
          </label>
          <label>
            Precio de compra (€)
            <input
              type="number"
              step="0.01"
              value={perfil.precioCompra}
              onChange={(e) => setCampo("precioCompra", e.target.value)}
            />
          </label>
          <label>
            Otros gastos compraventa (€)
            <input
              type="number"
              step="0.01"
              value={perfil.otrosGastosCompraventa}
              onChange={(e) => setCampo("otrosGastosCompraventa", e.target.value)}
            />
          </label>
          <p className="dato-calc">
            Inversión total <strong>{euros(cifras.inversion)}</strong>
          </p>
          <label>
            Renta mensual (€)
            <input
              type="number"
              step="0.01"
              value={perfil.rentaMensual}
              onChange={(e) => setCampo("rentaMensual", e.target.value)}
            />
          </label>
          <p className="dato-calc">
            Rentabilidad <strong>{porcentaje(cifras.rentabilidad)}</strong>
          </p>
          <label>
            Valoración actual (€)
            <input
              type="number"
              step="0.01"
              value={perfil.valoracionActual}
              onChange={(e) => setCampo("valoracionActual", e.target.value)}
            />
          </label>
          <label>
            Deuda actual (€)
            <input
              type="number"
              step="0.01"
              value={perfil.deudaActual}
              onChange={(e) => setCampo("deudaActual", e.target.value)}
            />
          </label>
          <p className="dato-calc">
            Equity <strong>{euros(cifras.equity)}</strong>
          </p>
        </div>
      </div>

      <div className="form-grid">
        <div>
          <h3>Alquiler</h3>
          <label>
            Datos del inquilino
            <input
              value={perfil.inquilino}
              onChange={(e) => setCampo("inquilino", e.target.value)}
            />
          </label>
          <label>
            DNI / NIE
            <input
              value={perfil.documento}
              onChange={(e) => setCampo("documento", e.target.value)}
            />
          </label>
          <label>
            Renta del contrato (€)
            <input
              type="number"
              step="0.01"
              value={perfil.renta}
              onChange={(e) => setCampo("renta", e.target.value)}
            />
          </label>
          <label>
            Fianza (€)
            <input
              type="number"
              step="0.01"
              value={perfil.deposito}
              onChange={(e) => setCampo("deposito", e.target.value)}
            />
          </label>
          <label>
            Inicio
            <input
              type="date"
              value={perfil.fechaInicio}
              onChange={(e) => setCampo("fechaInicio", e.target.value)}
            />
          </label>
          <label>
            Fin
            <input
              type="date"
              value={perfil.fechaFin}
              onChange={(e) => setCampo("fechaFin", e.target.value)}
            />
          </label>
          <label>
            Notas del contrato
            <textarea
              value={perfil.notasContrato}
              onChange={(e) => setCampo("notasContrato", e.target.value)}
              rows={3}
            />
          </label>
        </div>
        <div>
          <h3>Seguros y fiscal</h3>
          <p className="muted small">Seguro de hogar</p>
          <CamposSeguro
            datos={perfil.seguroHogar}
            onChange={(campo, valor) => setSeguro("seguroHogar", campo, valor)}
          />
          <p className="muted small">Seguro de impago</p>
          <CamposSeguro
            datos={perfil.seguroImpago}
            onChange={(campo, valor) => setSeguro("seguroImpago", campo, valor)}
          />
          <label>
            Datos fiscales
            <textarea
              value={perfil.datosFiscales}
              onChange={(e) => setCampo("datosFiscales", e.target.value)}
              rows={4}
              placeholder="NIF, comunidad de bienes, referencia…"
            />
          </label>
        </div>
      </div>

      <h3>Contactos</h3>
      {perfil.contactos.map((c, i) => (
        <div key={i} className="contacto-row">
          <input
            placeholder="Nombre"
            value={c.nombre}
            onChange={(e) => setContacto(i, "nombre", e.target.value)}
          />
          <input
            placeholder="Rol (administración, seguro…)"
            value={c.rol}
            onChange={(e) => setContacto(i, "rol", e.target.value)}
          />
          <input
            placeholder="Teléfono"
            value={c.telefono}
            onChange={(e) => setContacto(i, "telefono", e.target.value)}
          />
          <input
            placeholder="Email"
            value={c.email}
            onChange={(e) => setContacto(i, "email", e.target.value)}
          />
          {perfil.contactos.length > 1 ? (
            <button
              type="button"
              className="btn ghost tiny"
              onClick={() =>
                setPerfil((p) => ({
                  ...p,
                  contactos: p.contactos.filter((_, idx) => idx !== i),
                }))
              }
            >
              Quitar
            </button>
          ) : null}
        </div>
      ))}
      <button
        type="button"
        className="btn ghost"
        onClick={() =>
          setPerfil((p) => ({
            ...p,
            contactos: [...p.contactos, { nombre: "", rol: "", telefono: "", email: "" }],
          }))
        }
      >
        Añadir contacto
      </button>

      <div className="form-grid" style={{ marginTop: "1.2rem" }}>
        <Subida
          titulo="Escrituras"
          tipo="escritura"
          items={escrituras}
          viviendaId={viviendaId}
          onSubir={subir}
          onQuitar={quitarArchivo}
          onError={onError}
        />
        <Subida
          titulo="Planos"
          tipo="plano"
          items={planos}
          viviendaId={viviendaId}
          onSubir={subir}
          onQuitar={quitarArchivo}
          onError={onError}
        />
      </div>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
        <button type="button" className="btn ghost" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function CamposSeguro({ datos, onChange }) {
  return (
    <>
      <label>
        Compañía
        <input value={datos.compania} onChange={(e) => onChange("compania", e.target.value)} />
      </label>
      <label>
        Póliza
        <input value={datos.poliza} onChange={(e) => onChange("poliza", e.target.value)} />
      </label>
      <label>
        Vencimiento
        <input
          type="date"
          value={datos.vencimiento}
          onChange={(e) => onChange("vencimiento", e.target.value)}
        />
      </label>
      <label>
        Importe (€)
        <input
          type="number"
          step="0.01"
          value={datos.importe}
          onChange={(e) => onChange("importe", e.target.value)}
        />
      </label>
    </>
  );
}

function Subida({ titulo, tipo, items, viviendaId, onSubir, onQuitar, onError }) {
  return (
    <div>
      <h3>{titulo}</h3>
      <label className="file-label">
        Subir archivo (PDF o imagen, máx. 8 MB)
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onSubir(tipo, file);
            e.target.value = "";
          }}
        />
      </label>
      <ul className="archivos-lista">
        {items.map((a) => (
          <li key={a._id}>
            <button
              type="button"
              className="linkish"
              onClick={() => bajarArchivo(viviendaId, a._id, a.nombre).catch((err) => onError(err.message))}
            >
              {a.nombre}
            </button>
            <button type="button" className="btn ghost tiny" onClick={() => onQuitar(a)}>
              Quitar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
