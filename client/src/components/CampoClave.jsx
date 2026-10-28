import { useState } from "react";

export default function CampoClave({
  etiqueta = "Contraseña",
  value,
  onChange,
  autoComplete = "current-password",
  minLength,
  required = true,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label>
      {etiqueta}
      <span className="clave-wrap">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          minLength={minLength}
          required={required}
        />
        <button
          type="button"
          className="ojo"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Ver contraseña"}
          title={visible ? "Ocultar" : "Ver"}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 6c-5 0-9 4.5-10 6 1 1.5 5 6 10 6s9-4.5 10-6c-1-1.5-5-6-10-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
              />
              <path fill="currentColor" d="M3 3l18 18-1.4 1.4L1.6 4.4 3 3z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 6c-5 0-9 4.5-10 6 1 1.5 5 6 10 6s9-4.5 10-6c-1-1.5-5-6-10-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
              />
              <circle cx="12" cy="12" r="2.2" fill="var(--card)" />
            </svg>
          )}
        </button>
      </span>
    </label>
  );
}
