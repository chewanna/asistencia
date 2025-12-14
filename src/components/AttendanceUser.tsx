"use client";

import { useEffect, useMemo, useState } from "react";
import { DATA, MESAS, Person } from "@/lib/data";
import { norm } from "@/lib/text";
import { loadAttendance, saveAttendance } from "@/lib/storage";
import { Toggle } from "./Toggle";
import { Toast } from "./Toast";

function rowMatchesQuery(r: Person, query: string) {
  if (!query) return true;
  const hay = norm([r.nombre, r.ap, r.am, r.grado, String(r.id)].join(" "));
  return hay.includes(norm(query));
}

export default function AttendanceUser() {
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [lastMarkedId, setLastMarkedId] = useState<number | null>(null);

  // asignación de mesa como tu script: (id-1) % 30
  const dataWithMesa = useMemo(() => {
    return DATA.map((p) => ({
      ...p,
      mesa: MESAS[(p.id - 1) % MESAS.length],
    }));
  }, []);

  useEffect(() => {
    setAttendance(loadAttendance());
  }, []);

  function isPresent(id: number) {
    return !!attendance[id];
  }

  function setPresent(id: number, val: boolean) {
    const next = { ...attendance, [id]: !!val };
    setAttendance(next);
    saveAttendance(next);
  }

  const filtered = useMemo(() => {
    return dataWithMesa.filter((r) => rowMatchesQuery(r, q));
  }, [q, dataWithMesa]);

  const mesaAsignada = useMemo(() => {
    if (!lastMarkedId) return "—";
    const person = dataWithMesa.find((x) => x.id === lastMarkedId);
    return String(person?.mesa ?? "—");
  }, [lastMarkedId, dataWithMesa]);

  return (
    <>
      {/* tu subtitle/título centrado */}
      <div
        className="searchLabel"
        style={{
          maxWidth: 1100,
          margin: "18px auto 0",
          borderRadius: 18,
          textAlign: "center",
        }}
      >
        ASISTENCIA
      </div>

      <div className="wrap">
        <div className="top">
          <div className="searchCard">
            <div className="searchLabel">Nombre:</div>

            {/* versión “user”: searchRow en bloque y centrado */}
            <div
              style={{
                display: "block",
                padding: "20px 15px 10px",
                textAlign: "center",
              }}
            >
              <input
                type="text"
                placeholder="Escriba su nombre"
                autoComplete="off"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button
                className="btn"
                style={{ marginTop: 20 }}
                onClick={() => {
                  setQ("");
                  setLastMarkedId(null);
                  setToast("Búsqueda limpia.");
                }}
                type="button"
              >
                Limpiar búsqueda
              </button>
            </div>
          </div>

          {/* Mesa asignada */}
          <div className="stats" style={{ gridTemplateColumns: "1fr" }}>
            <div className="stat total">
              <div
                className="cap"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                Mesa asignada
              </div>
              <div className="val">{mesaAsignada}</div>
            </div>
          </div>
        </div>

        <div className="tableCard">
          <div className="tableHead">
            <div className="meta">
              Registros visibles: {filtered.length} / {dataWithMesa.length}
            </div>
            <div className="meta">Mesas: {MESAS.length}</div>
          </div>

          <div style={{ overflow: "auto", maxHeight: "72vh" }}>
            <table>
              <thead>
                <tr>
                  <th className="col-no">No.</th>
                  <th className="col-grado">Grado</th>
                  <th className="col-nombre">Nombre</th>
                  <th className="col-ap">Apellido paterno</th>
                  <th className="col-am">Apellido materno</th>
                  <th className="col-edad">Edad</th>
                  <th className="col-as">Asistencia</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r) => {
                  const present = isPresent(r.id);
                  return (
                    <tr key={r.id} className={present ? "present" : ""}>
                      <td className="col-no">{r.id}</td>
                      <td className="col-grado" title={r.grado}>{r.grado}</td>
                      <td className="col-nombre" title={r.nombre}>{r.nombre}</td>
                      <td className="col-ap" title={r.ap}>{r.ap}</td>
                      <td className="col-am" title={r.am}>{r.am}</td>
                      <td className="col-edad">{r.edad ?? ""}</td>
                      <td className="col-as">
                        <Toggle
                          checked={present}
                          onChange={(v) => {
                            setPresent(r.id, v);

                            if (v) setLastMarkedId(r.id);
                            else if (lastMarkedId === r.id) setLastMarkedId(null);

                            const mesa = r.mesa ?? "—";
                            setToast(
                              v
                                ? `Marcado como presente. Mesa asignada: ${mesa}`
                                : "Marcado como pendiente."
                            );
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </>
  );
}
