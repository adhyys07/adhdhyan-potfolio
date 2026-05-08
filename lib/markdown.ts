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
    .replace(/`([^`]+)`/g, "<code style=\"background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 3px; font-size: 0.9em; color: #d4f060;\">$1</code>")
    .replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, "<img src=\"$2\" alt=\"$1\" style=\"max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; border: 1px solid rgba(255,255,255,0.1);\" />")
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, "<a href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color: #d4f060; text-decoration: underline;\">$1</a>");
}
export function markdownToHtml(content: string) {
  const escaped = escapeHtml(content);

  let processed = escaped.replace(/```(?:[\w-]*\n)?([\s\S]*?)```/g, (match, code) => {
    const trimmedCode = code.trim();
    return `<pre style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px; overflow-x: auto; border: 1px solid rgba(255,255,255,0.1); margin: 16px 0;"><code style="color: #d4f060; font-family: JetBrains Mono, monospace; font-size: 0.9em;">${trimmedCode}</code></pre>`;
  });


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

    if (block === "---" || block === "***" || block === "___") {
      return `<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />`;
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