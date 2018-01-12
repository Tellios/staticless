import { injectable } from "inversify";
import * as marked from "marked";
import * as highlight from "highlight.js";
import { highlightAuto } from "highlight.js";

@injectable()
export class MarkdownParserService {
    private markedConfig: marked.MarkedOptions = {
        gfm: true,
        tables: true,
        breaks: true,
        renderer: this.getRenderer(),
        highlight: this.getHighlighter()
    };

    public parse(markdown: string): Promise<string> {
        return new Promise((resolve, reject) => {
            marked(markdown, this.markedConfig, (err: any, result: string) => {
                if (err) {
                    return reject(new Error(`Unable to parse markdown: ${err}`));
                }

                resolve(result);
            });
        });
    }

    private getRenderer() {
        const renderer = new marked.Renderer();

        renderer.heading = (text: string, level: number) => {
            const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");

            return [
                `<h${level} class="anchored-header">`,
                text,
                [
                    `<a name="${escapedText}" class="anchor" href="#${escapedText}">`,
                    `<span class="material-icons anchor-icon">link</span>`,
                    `</a>`
                ].join(""),
                `</h${level}>`
            ].join("");
        };

        renderer.codespan = (code: string) => {
            return `<code class="inline-code-block">${code}</code>`;
        };

        renderer.code = (code: string, language: string) => {
            if (language === "mermaid") {
                return [
                    `<pre class="code-block">`,
                    `<code class="mermaid">`,
                    code,
                    `</code>`,
                    `</pre>`
                ].join("");
            }

            const result = highlight.highlightAuto(code, [language]);

            return [
                `<pre class="hljs code-block">`,
                `<code class="${result.language}">`,
                result.value,
                `</code>`,
                `</pre>`
            ].join("");
        };

        return renderer;
    }

    private getHighlighter() {
        return (code: string): string => {
            return highlight.highlightAuto(code).value;
        };
    }
}
