export function handleZendeskPopup() {
    if (typeof window !== "undefined") return window.zE("webWidget", "open");
}
