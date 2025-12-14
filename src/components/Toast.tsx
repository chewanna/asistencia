"use client";

import { useEffect, useRef, useState } from "react";

export function Toast({ message }: { message: string }) {
  const [show, setShow] = useState(false);
  const last = useRef("");

  useEffect(() => {
    if (!message) return;
    if (message === last.current) return;
    last.current = message;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div
      className="toast"
      style={{ display: show ? "block" : "none" }}
      aria-live="polite"
    >
      {message}
    </div>
  );
}
