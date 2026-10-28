const fromEnv = import.meta.env.VITE_API_URL;
export const API_BASE =
  typeof fromEnv === "string" && fromEnv.trim()
    ? fromEnv.trim().replace(/\/+$/, "")
    : "";

export function getToken() {
  return localStorage.getItem("cartera_token") || "";
}

export function setSesion(token, usuario) {
  if (token) localStorage.setItem("cartera_token", token);
  if (usuario) localStorage.setItem("cartera_usuario", JSON.stringify(usuario));
}

export function clearSesion() {
  localStorage.removeItem("cartera_token");
  localStorage.removeItem("cartera_usuario");
}

export function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem("cartera_usuario") || "null");
  } catch {
    return null;
  }
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body:
      options.body && typeof options.body !== "string" && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || "No se ha podido completar la acción");
  }
  return data;
}

export function fechaCorta(valor) {
  if (!valor) return "—";
  return new Date(valor).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function euros(valor) {
  return Number(valor || 0).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  });
}
