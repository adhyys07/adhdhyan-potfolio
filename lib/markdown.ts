import MarkdownIt from "markdown-it";
import taskLists from "markdown-it-task-lists";

function slugifyHeading(input: string) {
  return input
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z0-9#]+;/gi, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function createMarkdownRenderer() {
  const markdown = new MarkdownIt({
    breaks: false,
    html: false,
    linkify: true,
    typographer: false,
  }).use(taskLists, {
    enabled: false,
    label: true,
    labelAfter: true,
  });

  const defaultFenceRenderer =
    markdown.renderer.rules.fence ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
  const defaultImageRenderer =
    markdown.renderer.rules.image ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
  const defaultLinkOpenRenderer =
    markdown.renderer.rules.link_open ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
  const defaultHeadingOpenRenderer =
    markdown.renderer.rules.heading_open ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

  markdown.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const nextToken = tokens[idx + 1];

    if (nextToken?.type === "inline" && nextToken.content) {
      tokens[idx].attrSet("id", slugifyHeading(nextToken.content));
    }

    return defaultHeadingOpenRenderer(tokens, idx, options, env, self);
  };

  markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet("href") ?? "";

    if (/^https?:\/\//i.test(href)) {
      tokens[idx].attrSet("target", "_blank");
      tokens[idx].attrSet("rel", "noopener noreferrer");
    }

    return defaultLinkOpenRenderer(tokens, idx, options, env, self);
  };

  markdown.renderer.rules.image = (tokens, idx, options, env, self) => {
    tokens[idx].attrJoin("class", "blog-image");
    tokens[idx].attrSet("loading", "lazy");
    return defaultImageRenderer(tokens, idx, options, env, self);
  };

  markdown.renderer.rules.fence = (tokens, idx, options, env, self) => {
    tokens[idx].attrJoin("class", "blog-code-block");
    return defaultFenceRenderer(tokens, idx, options, env, self);
  };

  return markdown;
}

const markdown = createMarkdownRenderer();

export function markdownToHtml(content: string) {
  return markdown.render(content);
}
