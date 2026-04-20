"use client";

import { useEffect, useState } from "react";

export default function BrtClock() {
  const [clock, setClock] = useState("—:— BRT");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
      const brt = new Date(utcMs - 3 * 60 * 60 * 1000);
      const hh = String(brt.getHours()).padStart(2, "0");
      const mm = String(brt.getMinutes()).padStart(2, "0");
      setClock(`${hh}:${mm} BRT`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <span>{clock}</span>;
}
