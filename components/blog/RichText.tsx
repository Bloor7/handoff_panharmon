import type React from "react";

export function renderRich(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="rich-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

type TipTapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type?: string }[];
  content?: TipTapNode[];
};

function renderInline(node: TipTapNode, key: string) {
  let child: React.ReactNode = node.text || node.content?.map((item, index) => renderInline(item, `${key}-${index}`)) || null;
  for (const mark of node.marks || []) {
    if (mark.type === "bold") child = <strong key={`${key}-b`} className="rich-bold">{child}</strong>;
    if (mark.type === "italic") child = <em key={`${key}-i`}>{child}</em>;
  }
  return <span key={key}>{child}</span>;
}

function renderNode(node: TipTapNode, key: string): React.ReactNode {
  const children = node.content?.map((item, index) => renderNode(item, `${key}-${index}`));
  const inlineChildren = node.content?.map((item, index) => renderInline(item, `${key}-${index}`));

  if (node.type === "heading") {
    const level = Number(node.attrs?.level || 2);
    return level === 3 ? <h3 key={key} className="blog-h">{inlineChildren}</h3> : <h2 key={key} className="blog-h">{inlineChildren}</h2>;
  }
  if (node.type === "paragraph") return <p key={key} className="blog-p">{inlineChildren}</p>;
  if (node.type === "bulletList") return <ul key={key} className="blog-list">{children}</ul>;
  if (node.type === "orderedList") return <ol key={key} className="blog-list">{children}</ol>;
  if (node.type === "listItem") return <li key={key}>{children}</li>;
  if (node.type === "blockquote") return <blockquote key={key} className="blog-quote">{children}</blockquote>;
  if (node.type === "hardBreak") return <br key={key} />;
  if (node.type === "image" && typeof node.attrs?.src === "string") {
    const alt = typeof node.attrs.alt === "string" ? node.attrs.alt : "";
    return <img key={key} className="blog-content-image" src={node.attrs.src} alt={alt} />;
  }
  if (node.type === "table") return <div key={key} className="blog-table-wrap"><table className="blog-table"><tbody>{children}</tbody></table></div>;
  if (node.type === "tableRow") return <tr key={key}>{children}</tr>;
  if (node.type === "tableHeader") return <th key={key}>{inlineChildren || children}</th>;
  if (node.type === "tableCell") return <td key={key}>{inlineChildren || children}</td>;
  if (node.type === "text") return renderInline(node, key);
  return children || null;
}

export function renderTipTap(content: unknown) {
  if (!content || typeof content !== "object") return null;
  const root = content as TipTapNode;
  return root.content?.map((node, index) => renderNode(node, `node-${index}`)) || null;
}
