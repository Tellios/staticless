import { injectable } from "inversify";
import * as marked from "marked";
import * as highlight from "highlight.js";
import { highlightAuto } from "highlight.js";
import * as url from "url";

@injectable()
export class MarkdownParserService {
    public parse(markdown: string, sourceName: string, pageSlug: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const markedConfig: marked.MarkedOptions = {
                gfm: true,
                tables: true,
                breaks: true,
                renderer: this.getRenderer(sourceName, pageSlug),
                highlight: this.getHighlighter()
            };

            marked(markdown, markedConfig, (err: any, result: string) => {
                if (err) {
                    return reject(new Error(`Unable to parse markdown: ${err}`));
                }

                resolve(result);
            });
        });
    }

    private getRenderer(sourceName: string, pageSlug: string) {
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

        renderer.link = (href: string, title: string, text: string): string => {
            href = this.getRootRelativeLink(href, sourceName, pageSlug);

            return [
                `<a href="${href}">`,
                text,
                "</a>"
            ].join("");
        };

        renderer.image = (href: string, title: string, text: string): string => {
            if (href.startsWith("/uploads")) {
                href = href.replace("/uploads", `/uploads/${encodeURIComponent(sourceName)}`);
            } else if (!href.startsWith("http")) {
                href = `${encodeURIComponent(sourceName)}/${href}`;
            }

            return [
                `<img src="${href}" alt="${text}" />`
            ].join("");

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

    private getRootRelativeLink(link: string, sourceName: string, pageSlug: string): string {
        if (link.startsWith("http")) {
            return link;
        } else if (link.startsWith("/")) {
            return `/${encodeURIComponent(sourceName)}${link}`;
        } else if (link.startsWith("./")) {
            const slugParts = pageSlug.split("/");
            return slugParts
                .slice(0, slugParts.length - 2)
                .concat(link.substring(2))
                .join("/");
        } else if (link.startsWith("..")) {
            const linkParts = link.split("/");
            let slugParts = pageSlug.split("/");

            const parts: string[] = [];

            linkParts.forEach((lp) => {
                if (lp === "..") {
                    slugParts = slugParts.slice(0, slugParts.length - 2);
                } else {
                    slugParts.push(lp);
                }
            });

            link = slugParts.join("/");
            return `/${encodeURIComponent(sourceName)}/${link}`;
        }

        return link;
    }
}
