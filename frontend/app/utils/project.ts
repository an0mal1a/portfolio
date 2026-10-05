import type { PortfolioProject } from "~/types/portfolio";

// Helpers de presentación compartidos por la home, el archivo y el detalle.

const STATUS_LABELS: Record<string, string> = {
    published: "Publicado",
    in_progress: "En curso",
    archived: "Archivado",
    draft: "Borrador",
};

const TYPE_LABELS: Record<string, string> = {
    saas: "SaaS",
    web: "Web",
    automation: "Automatización",
    tool: "Herramienta",
};

export const projectStatusLabel = (status: string) =>
    STATUS_LABELS[status] || status;

// Color del indicador de estado: rojo para lo que está vivo, verde para lo
// entregado y gris para lo archivado.
export const projectStatusTone = (status: string) =>
    ({
        in_progress: "bg-signal",
        published: "bg-emerald-500",
        archived: "bg-line-strong",
        draft: "bg-amber-400",
    })[status] || "bg-muted";

export const projectTypeLabel = (type: string) =>
    TYPE_LABELS[type.toLowerCase()] ||
    type.replace(/[-_]+/g, " ").replace(/^./, (letter) => letter.toUpperCase());

export const projectYear = (project: PortfolioProject) =>
    new Date(
        project.completed_at || project.started_at || project.created_at,
    ).getFullYear();

export const projectOwner = (project: PortfolioProject) =>
    project.client?.name || "Producto propio";

export const projectHost = (project: PortfolioProject) => {
    if (!project.live_url) return null;

    try {
        return new URL(project.live_url).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
};

export const padNumber = (value: number, length = 2) =>
    value.toString().padStart(length, "0");
