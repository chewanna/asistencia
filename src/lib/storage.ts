export const STORAGE_KEY = "asistencia_v1";
export const FILTER_KEY = "asistencia_filter_v1";

export type AttendanceState = Record<number, boolean>;
export type FilterMode = "all" | "present" | "pending";

export function loadAttendance(): AttendanceState {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveAttendance(state: AttendanceState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadPrefs(): { filterMode?: FilterMode } {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(FILTER_KEY) || "{}");
  } catch {
    return {};
  }
}

export function savePrefs(p: { filterMode?: FilterMode }) {
  localStorage.setItem(FILTER_KEY, JSON.stringify(p));
}
