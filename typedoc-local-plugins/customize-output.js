import { MarkdownPageEvent } from "typedoc-plugin-markdown";

export function load(app) {
    app.renderer.on(MarkdownPageEvent.END, (page) => {
        // Use a regex to remove timestamps from the content
        page.contents = page.contents.replace(/(\[.*js:)\d+(\])/g, "$1xx$2");

        // Ensure there is a newline at the end of the content
        if (!page.contents.endsWith("\n")) {
            page.contents += "\n";
        }
    });
}
