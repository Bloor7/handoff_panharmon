"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";

export function RichEditor({ name = "content", initialValue }: { name?: string; initialValue?: unknown }) {
  const [json, setJson] = useState(() => JSON.stringify(initialValue || { type: "doc", content: [{ type: "paragraph" }] }));
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content: initialValue || { type: "doc", content: [{ type: "paragraph" }] },
    onUpdate({ editor }) {
      setJson(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: "admin-editor-surface"
      }
    }
  });

  useEffect(() => {
    if (editor) setJson(JSON.stringify(editor.getJSON()));
  }, [editor]);

  return (
    <div className="admin-editor">
      <input type="hidden" name={name} value={json} />
      <div className="admin-editor-toolbar">
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>List</button>
        <button type="button" onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("URL ảnh");
            if (url) editor?.chain().focus().setImage({ src: url }).run();
          }}
        >
          Image
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
