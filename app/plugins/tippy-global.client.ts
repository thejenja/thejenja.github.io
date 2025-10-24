import { defineNuxtPlugin } from "#app";
import tippy, { createSingleton } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/animations/shift-away.css";

export default defineNuxtPlugin(() => {
  // Массив экземпляров tippy (используем any для упрощения)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tippyInstances: any[] = [];
  // Singleton для tippy (используем any для упрощения)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tippySingleton: any = null;

  // Функция для создания тултипов
  const createTooltip = (element: Element, content: string) => {
    if (!element || !content) return null;

    const instance = tippy(element, {
      content,
      theme: "light",
      placement: "top",
      arrow: true,
      animation: "shift-away",
      duration: [200, 150],
      delay: [300, 0],
      appendTo: () => document.body,
      zIndex: 9999,
      maxWidth: 240,
      offset: [0, 8],
      trigger: "mouseenter focus",
      hideOnClick: false,
      interactive: false,
    });

    tippyInstances.push(instance);
    return instance;
  };

  // Функция для создания singleton
  const createTooltipSingleton = () => {
    if (tippyInstances.length > 0) {
      if (tippySingleton) {
        tippySingleton.destroy();
      }

      tippySingleton = createSingleton(tippyInstances, {
        delay: [300, 0],
        moveTransition: "transform 0.2s ease-out",
        overrides: ["placement", "offset", "theme"],
      });
    }
  };

  // Функция для очистки всех тултипов
  const destroyAllTooltips = () => {
    if (tippySingleton) {
      tippySingleton.destroy();
      tippySingleton = null;
    }

    tippyInstances.forEach((instance) => {
      if (instance && typeof instance.destroy === "function") {
        instance.destroy();
      }
    });

    tippyInstances = [];
  };

  // Функция для обновления всех тултипов
  const updateAllTooltips = () => {
    destroyAllTooltips();
    
    // Находим все элементы с data-tooltip
    const tooltipElements = document.querySelectorAll("[data-tooltip]");
    
    tooltipElements.forEach((el) => {
      const content = el.getAttribute("data-tooltip");
      if (content) {
        createTooltip(el, content);
      }
    });
    
    createTooltipSingleton();
  };

  // Инициализация тултипов
  const initTooltips = () => {
    // Наблюдатель за изменениями в DOM
    const observer = new MutationObserver(() => {
      updateAllTooltips();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Инициализация при загрузке
    setTimeout(() => {
      updateAllTooltips();
    }, 100);

    // Обработчики для очистки
    window.addEventListener("beforeunload", () => {
      destroyAllTooltips();
      observer.disconnect();
    });

    return () => {
      destroyAllTooltips();
      observer.disconnect();
    };
  };

  return {
    provide: {
      tippy: {
        create: createTooltip,
        createSingleton: createTooltipSingleton,
        destroyAll: destroyAllTooltips,
        updateAll: updateAllTooltips,
        init: initTooltips,
      },
    },
  };
});