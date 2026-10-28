import { Link } from "react-router-dom";
import { getToken } from "../api.js";
import InstalarApp from "../components/InstalarApp.jsx";
import { DIAS_PRUEBA, PRECIO_ANUAL, PRECIO_MENSUAL } from "../lib/planes.js";

export default function Landing() {
  const dentro = Boolean(getToken());

  return (
    <div className="landing">
      <header className="landing-top">
        <p className="brand-mark">Cartera</p>
        <div className="landing-actions">
          {dentro ? (
            <Link className="btn" to="/panel">
              Ir al panel
            </Link>
          ) : (
            <>
              <Link className="btn ghost" to="/login">
                Entrar
              </Link>
              <Link className="btn" to="/registro">
                Probar {DIAS_PRUEBA} días
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">Para inversores con varias viviendas</p>
        <h1>Controla gastos, contratos y revisiones de toda tu cartera.</h1>
        <p className="lead">
          Añade cada inmueble, anota lo que cuesta, quién lo alquila y hasta cuándo. Lleva un mayor
          control de tus finanzas y recibe avisos de revisiones y vencimientos.
        </p>
        <div className="hero-actions">
          <Link className="btn large" to={dentro ? "/panel" : "/registro"}>
            {dentro ? "Abrir mi cartera" : "Empezar la prueba"}
          </Link>
          <InstalarApp variante="" />
        </div>
      </section>

      <section className="features">
        <article>
          <h2>Gastos por vivienda</h2>
          <p>Comunidad, IBI, seguro, reformas y suministros. Ves el coste real de cada piso.</p>
        </article>
        <article>
          <h2>Contratos de alquiler</h2>
          <p>A nombre de quién está, renta, fianza y fecha de fin. Nada de buscar papeles.</p>
        </article>
        <article>
          <h2>Alarmas de revisión</h2>
          <p>Caldera, seguro, ITE o lo que tú marques. El panel te enseña lo que caduca pronto.</p>
        </article>
        <article>
          <h2>Seguimiento</h2>
          <p>Contratos, revisiones y vencimientos de cada inmueble, vistos juntos en el panel.</p>
        </article>
      </section>

      <section className="pricing">
        <div>
          <p className="eyebrow">Suscripción</p>
          <h2>
            {DIAS_PRUEBA} días gratis. Luego {PRECIO_MENSUAL} € al mes o {PRECIO_ANUAL} € al año.
          </h2>
          <p>
            Precio único para toda la cartera, sin límite de viviendas. El cobro con tarjeta se
            conectará más adelante; ahora puedes registrarte y usar la prueba.
          </p>
        </div>
        <div className="price-cards">
          <article className="price-card alt">
            <p className="eyebrow">Mensual</p>
            <p className="price">{PRECIO_MENSUAL} € / mes</p>
            <p>Toda la plataforma. Cancela cuando quieras.</p>
            <Link className="btn" to="/registro">
              Empezar
            </Link>
          </article>
          <article className="price-card">
            <p className="eyebrow">Anual</p>
            <p className="price">{PRECIO_ANUAL} € / año</p>
            <p>Toda la plataforma. Un solo pago al año.</p>
            <Link className="btn" to="/registro">
              Empezar
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}
