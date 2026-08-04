import type { PortfolioProject } from "~/types/portfolio";

interface PendingProjectTransition {
    slug: string;
    overlay: HTMLImageElement;
    source: HTMLImageElement;
    sourceRect: DOMRect;
    sourceBorderRadius: string;
    sourceBoxShadow: string;
    timeout: ReturnType<typeof setTimeout>;
}

let pendingTransition: PendingProjectTransition | null = null;

const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const nextFrame = () =>
    new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const clearPendingTransition = () => {
    if (!pendingTransition) return;

    clearTimeout(pendingTransition.timeout);
    if (pendingTransition.source.isConnected) {
        pendingTransition.source.style.visibility = "";
    }
    pendingTransition.overlay.remove();
    pendingTransition = null;
};

export const useProjectImageTransition = () => {
    const router = useRouter();

    const openProject = async (
        event: MouseEvent,
        project: PortfolioProject,
    ) => {
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            !project.image ||
            prefersReducedMotion()
        ) {
            return;
        }

        const trigger = event.currentTarget as HTMLElement | null;
        const scope =
            trigger?.closest<HTMLElement>(
                "[data-project-transition-scope]",
            ) || trigger;
        const source =
            scope?.querySelector<HTMLImageElement>("[data-project-cover]");

        if (!source?.complete || !source.naturalWidth) return;

        event.preventDefault();
        clearPendingTransition();

        const rect = source.getBoundingClientRect();
        const sourceStyles = getComputedStyle(source);
        const overlay = document.createElement("img");

        overlay.src = source.currentSrc || source.src;
        overlay.alt = "";
        overlay.setAttribute("aria-hidden", "true");
        Object.assign(overlay.style, {
            position: "fixed",
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: "0",
            maxWidth: "none",
            objectFit: sourceStyles.objectFit,
            objectPosition: sourceStyles.objectPosition,
            borderRadius: sourceStyles.borderRadius,
            boxShadow: sourceStyles.boxShadow,
            pointerEvents: "none",
            transformOrigin: "top left",
            zIndex: "120",
        });

        document.body.appendChild(overlay);
        source.style.visibility = "hidden";

        const timeout = setTimeout(clearPendingTransition, 3_500);
        pendingTransition = {
            slug: project.slug,
            overlay,
            source,
            sourceRect: rect,
            sourceBorderRadius: sourceStyles.borderRadius,
            sourceBoxShadow: sourceStyles.boxShadow,
            timeout,
        };

        try {
            await router.push(`/projects/${project.slug}`);
        } catch (error) {
            clearPendingTransition();
            throw error;
        }
    };

    const completeProjectTransition = async (
        target: HTMLImageElement,
        slug: string,
    ) => {
        if (
            !pendingTransition ||
            pendingTransition.slug !== slug ||
            prefersReducedMotion()
        ) {
            return;
        }

        const transition = pendingTransition;

        await Promise.race([
            target.decode().catch(() => undefined),
            new Promise((resolve) => setTimeout(resolve, 500)),
        ]);
        await nextFrame();
        await nextFrame();

        if (pendingTransition !== transition) return;

        const rect = target.getBoundingClientRect();
        const targetStyles = getComputedStyle(target);

        if (!rect.width || !rect.height) {
            clearPendingTransition();
            return;
        }

        clearTimeout(transition.timeout);
        target.style.opacity = "0";

        const animation = transition.overlay.animate(
            [
                {
                    top: `${transition.sourceRect.top}px`,
                    left: `${transition.sourceRect.left}px`,
                    width: `${transition.sourceRect.width}px`,
                    height: `${transition.sourceRect.height}px`,
                    borderRadius: transition.sourceBorderRadius,
                    boxShadow: transition.sourceBoxShadow,
                },
                {
                    top: `${rect.top}px`,
                    left: `${rect.left}px`,
                    width: `${rect.width}px`,
                    height: `${rect.height}px`,
                    borderRadius: targetStyles.borderRadius,
                    boxShadow: targetStyles.boxShadow,
                },
            ],
            {
                duration: 720,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "forwards",
            },
        );

        try {
            await animation.finished;
        } finally {
            target.style.opacity = "";
            target.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 140,
                easing: "ease-out",
            });
            clearPendingTransition();
        }
    };

    return {
        openProject,
        completeProjectTransition,
    };
};
