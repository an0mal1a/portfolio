export const useReveal = () => {
  let observer: IntersectionObserver | undefined;
  let mutations: MutationObserver | undefined;

  const observe = () => {
    document
      .querySelectorAll<HTMLElement>("[data-reveal]:not([data-observed])")
      .forEach((element) => {
        element.dataset.observed = "true";
        observer?.observe(element);
      });
  };

  onMounted(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((element) => element.classList.add("is-visible"));
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    observe();
    mutations = new MutationObserver(observe);
    mutations.observe(document.body, { childList: true, subtree: true });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    mutations?.disconnect();
  });
};
