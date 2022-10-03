// Reformat path to return usable path for css
import { widgetsTags } from "../constants/widgetsTags.js";

export function createWidgetNode(widgetTag) {
    if (!Object.values(widgetsTags).includes(widgetTag)) {
        return null;
    }

    const template = document.createElement('template');
    template.innerHTML = `<${widgetTag}></${widgetTag}>`;
    return template.content.cloneNode(true);
}
