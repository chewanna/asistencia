"use client";

export function Toggle({
  checked,
  onChange,
  title = "Marcar asistencia",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title?: string;
}) {
  return (
    <label className="toggle" title={title}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="track">
        <span className="knob" />
      </span>
    </label>
  );
}
