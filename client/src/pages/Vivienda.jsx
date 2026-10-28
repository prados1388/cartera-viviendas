import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, euros, fechaCorta } from "../api.js";
import BloqueResultado from "../components/BloqueResultado.jsx";
import { MESES } from "../lib/cifras.js";

const pestanas = [
  { id: "gastos", label: "Gastos" },
  { id: "contratos", label: "Contrato" },
  { id: "alarmas", label: "Alarmas" },
  { id: "plagas", label: "Plagas" },
];

const tiposVivienda = [
  { value: "piso", label: "Piso" },
  { value: "casa", label: "Casa" },
  { value: "local", label: "Local" },
  { value: "otro", label: "Otro" },
];

const categorias = ["comunidad", "ibi", "seguro", "reforma", "suministros", "plagas", "otro"];
const tiposAlarma = ["revision", "plagas", "contrato", "otro"];

export default function Vivienda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("gastos");
  const [ficha, setFicha] = useState(null);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState("");
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  async function cargar() {
    const ahora = new Date();
    const [res, resu] = await Promise.all([
      api(`/api/viviendas/${id}`),
      api(
        `/api/resultados?anio=${ahora.getFullYear()}&mes=${ahora.getMonth() + 1}&vivienda=${id}`
      ),
    ]);
    setFicha(res.data);
    setResultados(resu.data);
  }

  useEffect(() => {
    setEditandoPerfil(false);
    cargar().catch((err) => setError(err.message));
  }, [id]);

  function abrirEdicion() {
    const v = ficha.vivienda;
    const c = ficha.contratos.find((x) => x.activo) || ficha.contratos[0];
    setPerfil({
      alias: v.alias,
      direccion: v.direccion,
      ciudad: v.ciudad || "",
      tipo: v.tipo || "piso",
      notas: v.notas || "",
      contratoId: c?._id || "",
      inquilino: c?.inquilino || "",
      documento: c?.documento || "",
      fechaInicio: fechaInput(c?.fechaInicio),
      fechaFin: fechaInput(c?.fechaFin),
      renta: c ? String(c.renta ?? "") : "",
      deposito: c ? String(c.deposito ?? "") : "",
      notasContrato: c?.notas || "",
    });
    setEditandoPerfil(true);
  }

  async function guardarPerfil(e) {
    e.preventDefault();
    setError("");
    setGuardandoPerfil(true);
    try {
      if (perfil.inquilino && (!perfil.fechaInicio || !perfil.fechaFin)) {
        throw new Error("Para guardar el alquiler hacen falta las fechas de inicio y fin");
      }
      await api(`/api/viviendas/${id}`, {
        method: "PUT",
        body: {
          alias: perfil.alias,
          direccion: perfil.direccion,
          ciudad: perfil.ciudad,
          tipo: perfil.tipo,
          notas: perfil.notas,
        },
      });
      if (perfil.inquilino && perfil.fechaInicio && perfil.fechaFin) {
        const body = {
          inquilino: perfil.inquilino,
          documento: perfil.documento,
          fechaInicio: perfil.fechaInicio,
          fechaFin: perfil.fechaFin,
          renta: Number(perfil.renta || 0),
          deposito: Number(perfil.deposito || 0),
          notas: perfil.notasContrato,
        };
        if (perfil.contratoId) {
          await api(`/api/viviendas/${id}/contratos/${perfil.contratoId}`, {
            method: "PUT",
            body,
          });
        } else {
          await api(`/api/viviendas/${id}/contratos`, { method: "POST", body });
        }
      }
      setEditandoPerfil(false);
      await cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardandoPerfil(false);
    }
  }

  async function borrarVivienda() {
    if (!confirm("¿Borrar esta vivienda y todo su historial?")) return;
    await api(`/api/viviendas/${id}`, { method: "DELETE" });
    navigate("/viviendas");
  }

  if (!ficha) {
    return <p className="muted">{error || "Cargando ficha…"}</p>;
  }

  const { vivienda, gastos, contratos, alarmas, plagas } = ficha;
  const contratoActivo = contratos.find((c) => c.activo) || contratos[0];

  return (
    <div>
      <p className="back">
        <Link to="/viviendas">← Viviendas</Link>
      </p>
      <header className="page-head">
        <div>
          <p className="eyebrow">{vivienda.tipo}</p>
          <h1>{vivienda.alias}</h1>
          <p className="muted">
            {vivienda.direccion}
            {vivienda.ciudad ? ` · ${vivienda.ciudad}` : ""}
          </p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn" onClick={editandoPerfil ? () => setEditandoPerfil(false) : abrirEdicion}>
            {editandoPerfil ? "Cerrar" : "Editar"}
          </button>
          <button type="button" className="btn ghost" onClick={borrarVivienda}>
            Borrar
          </button>
        </div>
      </header>

      {editandoPerfil && perfil ? (
        <form className="card" onSubmit={guardarPerfil}>
          <h2>Editar vivienda</h2>
          <div className="form-grid">
            <div>
              <h3>Inmueble</h3>
              <label>
                Alias
                <input
                  value={perfil.alias}
                  onChange={(e) => setPerfil({ ...perfil, alias: e.target.value })}
                  required
                />
              </label>
              <label>
                Dirección
                <input
                  value={perfil.direccion}
                  onChange={(e) => setPerfil({ ...perfil, direccion: e.target.value })}
                  required
                />
              </label>
              <label>
                Ciudad
                <input
                  value={perfil.ciudad}
                  onChange={(e) => setPerfil({ ...perfil, ciudad: e.target.value })}
                />
              </label>
              <label>
                Tipo
                <select
                  value={perfil.tipo}
                  onChange={(e) => setPerfil({ ...perfil, tipo: e.target.value })}
                >
                  {tiposVivienda.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Notas del inmueble
                <textarea
                  value={perfil.notas}
                  onChange={(e) => setPerfil({ ...perfil, notas: e.target.value })}
                  rows={3}
                />
              </label>
            </div>
            <div>
              <h3>Alquiler</h3>
              <label>
                Nombre del inquilino
                <input
                  value={perfil.inquilino}
                  onChange={(e) => setPerfil({ ...perfil, inquilino: e.target.value })}
                />
              </label>
              <label>
                DNI / NIE
                <input
                  value={perfil.documento}
                  onChange={(e) => setPerfil({ ...perfil, documento: e.target.value })}
                />
              </label>
              <label>
                Renta mensual (€)
                <input
                  type="number"
                  step="0.01"
                  value={perfil.renta}
                  onChange={(e) => setPerfil({ ...perfil, renta: e.target.value })}
                />
              </label>
              <label>
                Fianza (€)
                <input
                  type="number"
                  step="0.01"
                  value={perfil.deposito}
                  onChange={(e) => setPerfil({ ...perfil, deposito: e.target.value })}
                />
              </label>
              <label>
                Inicio de contrato
                <input
                  type="date"
                  value={perfil.fechaInicio}
                  onChange={(e) => setPerfil({ ...perfil, fechaInicio: e.target.value })}
                />
              </label>
              <label>
                Fin de contrato
                <input
                  type="date"
                  value={perfil.fechaFin}
                  onChange={(e) => setPerfil({ ...perfil, fechaFin: e.target.value })}
                />
              </label>
              <label>
                Notas del contrato
                <textarea
                  value={perfil.notasContrato}
                  onChange={(e) => setPerfil({ ...perfil, notasContrato: e.target.value })}
                  rows={3}
                />
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn" type="submit" disabled={guardandoPerfil}>
              {guardandoPerfil ? "Guardando…" : "Guardar cambios"}
            </button>
            <button type="button" className="btn ghost" onClick={() => setEditandoPerfil(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : null}

      <div className="stat-row compact">
        <article className="card stat">
          <p className="muted">Inquilino</p>
          <p className="stat-num small">{contratoActivo?.inquilino || "Sin contrato"}</p>
        </article>
        <article className="card stat">
          <p className="muted">Renta</p>
          <p className="stat-num small">
            {contratoActivo ? `${euros(contratoActivo.renta)}/mes` : "—"}
          </p>
        </article>
        <article className="card stat">
          <p className="muted">Fin de contrato</p>
          <p className="stat-num small">{fechaCorta(contratoActivo?.fechaFin)}</p>
        </article>
      </div>

      {resultados ? (
        <>
          <BloqueResultado
            titulo={`${MESES[resultados.mes - 1]} · esta vivienda`}
            datos={resultados.conjunto.mes}
          />
          <BloqueResultado
            titulo={`${resultados.anio} · esta vivienda`}
            datos={resultados.conjunto.anio}
          />
        </>
      ) : null}

      <div className="tabs">
        {pestanas.map((p) => (
          <button
            key={p.id}
            type="button"
            className={tab === p.id ? "tab on" : "tab"}
            onClick={() => setTab(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error ? <p className="error">{error}</p> : null}

      {tab === "gastos" ? (
        <Gastos viviendaId={id} items={gastos} recargar={cargar} onError={setError} />
      ) : null}
      {tab === "contratos" ? (
        <Contratos viviendaId={id} items={contratos} recargar={cargar} onError={setError} />
      ) : null}
      {tab === "alarmas" ? (
        <Alarmas viviendaId={id} items={alarmas} recargar={cargar} onError={setError} />
      ) : null}
      {tab === "plagas" ? (
        <Plagas viviendaId={id} items={plagas} recargar={cargar} onError={setError} />
      ) : null}
    </div>
  );
}

function Gastos({ viviendaId, items, recargar, onError }) {
  const vacio = { concepto: "", categoria: "otro", importe: "", fecha: hoy(), notas: "" };
  const [form, setForm] = useState(vacio);
  const [editId, setEditId] = useState(null);

  function cancelar() {
    setEditId(null);
    setForm({ ...vacio, fecha: hoy() });
  }

  function editar(g) {
    setEditId(g._id);
    setForm({
      concepto: g.concepto,
      categoria: g.categoria,
      importe: String(g.importe ?? ""),
      fecha: fechaInput(g.fecha),
      notas: g.notas || "",
    });
  }

  async function guardar(e) {
    e.preventDefault();
    try {
      const body = { ...form, importe: Number(form.importe) };
      const url = editId
        ? `/api/viviendas/${viviendaId}/gastos/${editId}`
        : `/api/viviendas/${viviendaId}/gastos`;
      await api(url, { method: editId ? "PUT" : "POST", body });
      cancelar();
      await recargar();
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <div className="split">
      <form className="card" onSubmit={guardar}>
        <h2>{editId ? "Editar gasto" : "Nuevo gasto"}</h2>
        <label>
          Concepto
          <input
            value={form.concepto}
            onChange={(e) => setForm({ ...form, concepto: e.target.value })}
            required
          />
        </label>
        <label>
          Categoría
          <select
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Importe (€)
          <input
            type="number"
            step="0.01"
            value={form.importe}
            onChange={(e) => setForm({ ...form, importe: e.target.value })}
            required
          />
        </label>
        <label>
          Fecha
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            required
          />
        </label>
        <AccionesForm
          editando={Boolean(editId)}
          onCancelar={cancelar}
          textoNuevo="Añadir gasto"
          textoEditar="Guardar cambios"
        />
      </form>
      <Lista
        vacio="Todavía no hay gastos."
        items={items}
        viviendaId={viviendaId}
        ruta="gastos"
        recargar={recargar}
        onEditar={editar}
        render={(g) => (
          <>
            <strong>
              {g.concepto} · {euros(g.importe)}
            </strong>
            <span>
              {g.categoria} · {fechaCorta(g.fecha)}
            </span>
          </>
        )}
      />
    </div>
  );
}

function Contratos({ viviendaId, items, recargar, onError }) {
  const vacio = {
    inquilino: "",
    documento: "",
    fechaInicio: hoy(),
    fechaFin: "",
    renta: "",
    deposito: "",
    notas: "",
  };
  const [form, setForm] = useState(vacio);
  const [editId, setEditId] = useState(null);

  function cancelar() {
    setEditId(null);
    setForm({ ...vacio, fechaInicio: hoy() });
  }

  function editar(c) {
    setEditId(c._id);
    setForm({
      inquilino: c.inquilino,
      documento: c.documento || "",
      fechaInicio: fechaInput(c.fechaInicio),
      fechaFin: fechaInput(c.fechaFin),
      renta: String(c.renta ?? ""),
      deposito: String(c.deposito ?? ""),
      notas: c.notas || "",
    });
  }

  async function guardar(e) {
    e.preventDefault();
    try {
      const body = {
        ...form,
        renta: Number(form.renta || 0),
        deposito: Number(form.deposito || 0),
      };
      const url = editId
        ? `/api/viviendas/${viviendaId}/contratos/${editId}`
        : `/api/viviendas/${viviendaId}/contratos`;
      await api(url, { method: editId ? "PUT" : "POST", body });
      cancelar();
      await recargar();
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <div className="split">
      <form className="card" onSubmit={guardar}>
        <h2>{editId ? "Editar contrato" : "Contrato de alquiler"}</h2>
        <label>
          A nombre de
          <input
            value={form.inquilino}
            onChange={(e) => setForm({ ...form, inquilino: e.target.value })}
            required
          />
        </label>
        <label>
          DNI / NIE
          <input
            value={form.documento}
            onChange={(e) => setForm({ ...form, documento: e.target.value })}
          />
        </label>
        <label>
          Inicio
          <input
            type="date"
            value={form.fechaInicio}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            required
          />
        </label>
        <label>
          Fin
          <input
            type="date"
            value={form.fechaFin}
            onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
            required
          />
        </label>
        <label>
          Renta mensual (€)
          <input
            type="number"
            step="0.01"
            value={form.renta}
            onChange={(e) => setForm({ ...form, renta: e.target.value })}
          />
        </label>
        <label>
          Fianza (€)
          <input
            type="number"
            step="0.01"
            value={form.deposito}
            onChange={(e) => setForm({ ...form, deposito: e.target.value })}
          />
        </label>
        <AccionesForm
          editando={Boolean(editId)}
          onCancelar={cancelar}
          textoNuevo="Guardar contrato"
          textoEditar="Guardar cambios"
        />
      </form>
      <Lista
        vacio="No hay contratos en esta vivienda."
        items={items}
        viviendaId={viviendaId}
        ruta="contratos"
        recargar={recargar}
        onEditar={editar}
        render={(c) => (
          <>
            <strong>{c.inquilino}</strong>
            <span>
              {c.documento ? `${c.documento} · ` : ""}
              {fechaCorta(c.fechaInicio)} → {fechaCorta(c.fechaFin)} · {euros(c.renta)}/mes
            </span>
          </>
        )}
      />
    </div>
  );
}

function Alarmas({ viviendaId, items, recargar, onError }) {
  const vacio = { tipo: "revision", titulo: "", fecha: hoy(), notas: "" };
  const [form, setForm] = useState(vacio);
  const [editId, setEditId] = useState(null);

  function cancelar() {
    setEditId(null);
    setForm({ ...vacio, fecha: hoy() });
  }

  function editar(a) {
    setEditId(a._id);
    setForm({
      tipo: a.tipo,
      titulo: a.titulo,
      fecha: fechaInput(a.fecha),
      notas: a.notas || "",
    });
  }

  async function guardar(e) {
    e.preventDefault();
    try {
      const url = editId
        ? `/api/viviendas/${viviendaId}/alarmas/${editId}`
        : `/api/viviendas/${viviendaId}/alarmas`;
      await api(url, { method: editId ? "PUT" : "POST", body: form });
      cancelar();
      await recargar();
    } catch (err) {
      onError(err.message);
    }
  }

  async function marcar(item) {
    await api(`/api/viviendas/${viviendaId}/alarmas/${item._id}`, {
      method: "PATCH",
      body: { hecha: !item.hecha },
    });
    await recargar();
  }

  return (
    <div className="split">
      <form className="card" onSubmit={guardar}>
        <h2>{editId ? "Editar alarma" : "Nueva alarma"}</h2>
        <label>
          Tipo
          <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            {tiposAlarma.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label>
          Título (ej. Revisión caldera)
          <input
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />
        </label>
        <label>
          Fecha
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            required
          />
        </label>
        <AccionesForm
          editando={Boolean(editId)}
          onCancelar={cancelar}
          textoNuevo="Crear aviso"
          textoEditar="Guardar cambios"
        />
      </form>
      <ul className="card lista">
        {items.length === 0 ? (
          <li className="muted">Sin alarmas todavía.</li>
        ) : (
          items.map((a) => (
            <li key={a._id} className={a.hecha ? "hecha" : ""}>
              <div>
                <strong>{a.titulo}</strong>
                <span>
                  {a.tipo} · {fechaCorta(a.fecha)}
                </span>
              </div>
              <div className="row-actions">
                <button type="button" className="btn ghost tiny" onClick={() => editar(a)}>
                  Editar
                </button>
                <button type="button" className="btn ghost tiny" onClick={() => marcar(a)}>
                  {a.hecha ? "Reabrir" : "Hecha"}
                </button>
                <Borrar viviendaId={viviendaId} ruta="alarmas" id={a._id} recargar={recargar} />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function Plagas({ viviendaId, items, recargar, onError }) {
  const vacio = { fecha: hoy(), tratamiento: "", empresa: "", proximaRevision: "", notas: "" };
  const [form, setForm] = useState(vacio);
  const [editId, setEditId] = useState(null);

  function cancelar() {
    setEditId(null);
    setForm({ ...vacio, fecha: hoy() });
  }

  function editar(p) {
    setEditId(p._id);
    setForm({
      fecha: fechaInput(p.fecha),
      tratamiento: p.tratamiento,
      empresa: p.empresa || "",
      proximaRevision: fechaInput(p.proximaRevision),
      notas: p.notas || "",
    });
  }

  async function guardar(e) {
    e.preventDefault();
    try {
      const url = editId
        ? `/api/viviendas/${viviendaId}/plagas/${editId}`
        : `/api/viviendas/${viviendaId}/plagas`;
      await api(url, { method: editId ? "PUT" : "POST", body: form });
      cancelar();
      await recargar();
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <div className="split">
      <form className="card" onSubmit={guardar}>
        <h2>{editId ? "Editar tratamiento" : "Tratamiento de plagas"}</h2>
        <label>
          Fecha
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            required
          />
        </label>
        <label>
          Tratamiento
          <input
            value={form.tratamiento}
            onChange={(e) => setForm({ ...form, tratamiento: e.target.value })}
            required
          />
        </label>
        <label>
          Empresa
          <input
            value={form.empresa}
            onChange={(e) => setForm({ ...form, empresa: e.target.value })}
          />
        </label>
        <label>
          Próxima revisión
          <input
            type="date"
            value={form.proximaRevision}
            onChange={(e) => setForm({ ...form, proximaRevision: e.target.value })}
          />
        </label>
        <AccionesForm
          editando={Boolean(editId)}
          onCancelar={cancelar}
          textoNuevo="Registrar"
          textoEditar="Guardar cambios"
        />
      </form>
      <Lista
        vacio="Sin controles de plaga."
        items={items}
        viviendaId={viviendaId}
        ruta="plagas"
        recargar={recargar}
        onEditar={editar}
        render={(p) => (
          <>
            <strong>{p.tratamiento}</strong>
            <span>
              {fechaCorta(p.fecha)}
              {p.empresa ? ` · ${p.empresa}` : ""}
              {p.proximaRevision ? ` · próxima ${fechaCorta(p.proximaRevision)}` : ""}
            </span>
          </>
        )}
      />
    </div>
  );
}

function Lista({ items, vacio, viviendaId, ruta, recargar, render, onEditar }) {
  return (
    <ul className="card lista">
      {items.length === 0 ? (
        <li className="muted">{vacio}</li>
      ) : (
        items.map((item) => (
          <li key={item._id}>
            <div>{render(item)}</div>
            <div className="row-actions">
              {onEditar ? (
                <button type="button" className="btn ghost tiny" onClick={() => onEditar(item)}>
                  Editar
                </button>
              ) : null}
              <Borrar viviendaId={viviendaId} ruta={ruta} id={item._id} recargar={recargar} />
            </div>
          </li>
        ))
      )}
    </ul>
  );
}

function AccionesForm({ editando, onCancelar, textoNuevo, textoEditar }) {
  return (
    <div className="form-actions">
      <button className="btn" type="submit">
        {editando ? textoEditar : textoNuevo}
      </button>
      {editando ? (
        <button type="button" className="btn ghost" onClick={onCancelar}>
          Cancelar
        </button>
      ) : null}
    </div>
  );
}

function Borrar({ viviendaId, ruta, id, recargar }) {
  async function quitar() {
    await api(`/api/viviendas/${viviendaId}/${ruta}/${id}`, { method: "DELETE" });
    await recargar();
  }
  return (
    <button type="button" className="btn ghost tiny" onClick={quitar}>
      Quitar
    </button>
  );
}

function hoy() {
  return new Date().toISOString().slice(0, 10);
}

function fechaInput(valor) {
  if (!valor) return "";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
