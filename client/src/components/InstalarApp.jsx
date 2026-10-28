import { useEffect, useState } from "react";

export default function InstalarApp({ variante = "ghost" }) {
  const [evento, setEvento] = useState(null);
  const [instalada, setInstalada] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (standalone) {
      setInstalada(true);
      return;
    }

    function guardar(e) {
      e.preventDefault();
      setEvento(e);
    }
    function yaInstalada() {
      setInstalada(true);
      setEvento(null);
    }
    window.addEventListener("beforeinstallprompt", guardar);
    window.addEventListener("appinstalled", yaInstalada);
    return () => {
      window.removeEventListener("beforeinstallprompt", guardar);
      window.removeEventListener("appinstalled", yaInstalada);
    };
  }, []);

  if (instalada) return null;

  async function instalar() {
    if (!evento) return;
    evento.prompt();
    await evento.userChoice;
    setEvento(null);
  }

  if (evento) {
    return (
      <button type="button" className={`btn ${variante}`} onClick={instalar}>
        Instalar app
      </button>
    );
  }

  return (
    <p className="muted small instalar-ayuda">
      En el móvil: menú del navegador → <strong>Añadir a pantalla de inicio</strong>.
    </p>
  );
}
