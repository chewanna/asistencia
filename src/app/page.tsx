"use client";

export default function Home() {
  return (
    <div className="wrap">
      <div className="searchCard">
        <div className="searchLabel" style={{ textAlign: "center" }}>
          ASISTENCIA
        </div>

        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          {/* <a className="btn" href="/admin" style={{ textAlign: "center" }}>
            Entrar a Administrador
          </a> */}

          <a className="btn" href="/asistencia" style={{ textAlign: "center" }}>
            Entrar a Usuario
          </a>
        </div>
      </div>
    </div>
  );
}

