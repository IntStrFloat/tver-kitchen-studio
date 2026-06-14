"use client";

import { useEffect } from "react";
import { GOALS, trackGoal } from "@/lib/analytics";

/**
 * Глобальный делегированный слушатель: ловит клики по любым ссылкам tel:
 * на сайте и отправляет цель «call» в Яндекс.Метрику. Так не нужно вешать
 * обработчик на каждую кнопку звонка по отдельности.
 */
const AnalyticsListener = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.('a[href^="tel:"]');
      if (link) {
        trackGoal(GOALS.call);
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
};

export default AnalyticsListener;
