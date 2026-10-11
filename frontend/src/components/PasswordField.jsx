import { useState } from "react";

function PasswordField({
  value,
  onChange,
  disabled = false,
  autoComplete = "current-password"
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="password-field mb-3">
      <input
        className="form-control"
        type={isVisible ? "text" : "password"}
        placeholder="Password"
        value={value}
        disabled={disabled}
        onChange={onChange}
        autoComplete={autoComplete}
        required
      />
      <button
        className="password-field__toggle"
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        disabled={disabled}
      >
        {isVisible ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
            <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.4 9.5 7-.4 1.1-1.2 2.3-2.2 3.4M6.2 6.2C3.9 7.6 2.7 9.7 2.5 12c.6 1.7 3.8 7 9.5 7 1.2 0 2.3-.2 3.3-.7" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default PasswordField;
