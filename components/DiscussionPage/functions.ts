export function scrollToBottom(selector: string) {
    const element: HTMLElement = document.querySelector(selector);
    if (element) element.scrollTop = element.scrollHeight;
}
