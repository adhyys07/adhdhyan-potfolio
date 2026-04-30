function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function applyInlineFormatting(input: string) {
  return input
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code class=\"rounded bg-slate-100 px-1 py-0.5 text-sm\">$1</code>")
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, "<a href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline decoration-slate-400 underline-offset-4\">$1</a>");
}

export function markdownToHtml(content: string) {
  const escaped = escapeHtml(content);
  const blocks = escaped
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  const htmlBlocks = blocks.map((block) => {
    if (block.startsWith("### ")) {
      return `<h3 class=\"text-xl font-semibold tracking-tight text-slate-950\">${applyInlineFormatting(block.replace(/^###\s+/, ""))}</h3>`;
    }

    if (block.startsWith("## ")) {
      return `<h2 class=\"text-2xl font-semibold tracking-tight text-slate-950\">${applyInlineFormatting(block.replace(/^##\s+/, ""))}</h2>`;
    }

    if (block.startsWith("# ")) {
      return `<h1 class=\"text-3xl font-semibold tracking-tight text-slate-950\">${applyInlineFormatting(block.replace(/^#\s+/, ""))}</h1>`;
    }

    const lines = block.split("\n").map((line) => line.trim());
    const isList = lines.every((line) => line.startsWith("- "));

    if (isList) {
      const items = lines
        .map((line) => `<li>${applyInlineFormatting(line.replace(/^-\s+/, ""))}</li>`)
        .join("");

      return `<ul class=\"list-disc space-y-2 pl-6 text-base leading-8 text-slate-700\">${items}</ul>`;
    }

    const withBreaks = applyInlineFormatting(block).replace(/\n/g, "<br />");
    return `<p class=\"text-base leading-8 text-slate-700\">${withBreaks}</p>`;
  });

  return htmlBlocks.join("\n");
}