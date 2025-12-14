"use client";

import { useEffect, useMemo, useState } from "react";
import { DATA, Person } from "@/lib/data";
import { norm } from "@/lib/text";
import {
  FilterMode,
  loadAttendance,
  loadPrefs,
  saveAttendance,
  savePrefs,
} from "@/lib/storage";
import { Toggle } from "./Toggle";
import { Toast } from "./Toast";

function rowMatchesQuery(r: Person, query: string) {
  if (!query) return true;
  const hay = norm([r.nombre, r.ap, r.am, r.grado, String(r.id)].join(" "));
  return hay.includes(norm(query));
}

export default function AttendanceAdmin() {
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  useEffect(() => {
    setAttendance(loadAttendance());
    const prefs = loadPrefs();
    setFilterMode(prefs.filterMode || "all");
  }, []);

  function isPresent(id: number) {
    return !!attendance[id];
  }

  function setPresent(id: number, val: boolean) {
    const next = { ...attendance, [id]: !!val };
    setAttendance(next);
    saveAttendance(next);
  }

  function countPresent() {
    let c = 0;
    for (const r of DATA) if (isPresent(r.id)) c++;
    return c;
  }

  const filtered = useMemo(() => {
    return DATA.filter((r) => rowMatchesQuery(r, q)).filter((r) => {
      if (filterMode === "present") return isPresent(r.id);
      if (filterMode === "pending") return !isPresent(r.id);
      return true;
    });
  }, [q, filterMode, attendance]);

  const total = DATA.length;
  const pres = countPresent();
  const pend = total - pres;

  function toggleFilter(next: FilterMode) {
    const fm: FilterMode = filterMode === next ? "all" : next;
    setFilterMode(fm);
    savePrefs({ filterMode: fm });
  }

  const presentBg = filterMode === "present" ? "rgba(34,197,94,.22)" : "rgba(255,255,255,.08)";
  const pendingBg = filterMode === "pending" ? "rgba(253,224,71,.25)" : "rgba(255,255,255,.08)";

  return (
    <>
      <div className="wrap">
        <div className="top">
          <div className="searchCard">
            <div className="searchLabel">BUSCAR NOMBRE:</div>
            <div className="searchRow">
              <input
                type="text"
                placeholder="Escribe un nombre"
                autoComplete="off"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button
                className="btn"
                id="btnClear"
                onClick={() => {
                  setQ("");
                  setToast("Búsqueda limpia.");
                }}
                type="button"
              >
                Limpiar búsqueda
              </button>

              <span
                className="pill"
                style={{ background: presentBg, justifyContent: "center" }}
                onClick={() => toggleFilter("present")}
              >
                Solo presentes
              </span>

              <span
                className="pill"
                style={{ background: pendingBg, justifyContent: "center" }}
                onClick={() => toggleFilter("pending")}
              >
                Solo pendientes
              </span>

              <button
                className="btn danger"
                title="Borra toda la asistencia guardada"
                onClick={() => {
                  const ok = confirm(
                    "¿Reiniciar asistencia? Esto borrará lo guardado en ESTE dispositivo."
                  );
                  if (!ok) return;
                  setAttendance({});
                  saveAttendance({});
                  setToast("Asistencia reiniciada.");
                }}
                type="button"
                style={{ gridColumn: "1 / -1" }}
              >
                Reiniciar asistencia
              </button>
            </div>
          </div>

          <div className="stats">
            <div className="stat total">
              <div className="cap">TOTAL</div>
              <div className="val">{total}</div>
            </div>
            <div className="stat presentes">
              <div className="cap">PRESENTES</div>
              <div className="val">{pres}</div>
            </div>
            <div className="stat pendientes">
              <div className="cap">PENDIENTES</div>
              <div className="val">{pend}</div>
            </div>
          </div>
        </div>

        <div className="tableCard">
          <div className="tableHead">
            <div className="meta">
              Registros visibles: {filtered.length} / {DATA.length}
            </div>
            <div className="meta">
              {filterMode === "present"
                ? "Filtro: solo presentes"
                : filterMode === "pending"
                ? "Filtro: solo pendientes"
                : "Filtro: todos"}
            </div>
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
                            setToast(v ? "Marcado como presente." : "Marcado como pendiente.");
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
