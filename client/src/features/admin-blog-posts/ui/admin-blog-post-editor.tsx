import { useEffect } from 'react';
import LinkExtension from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Button } from '../../../shared/ui';
import type { BlogPostContentJson } from '../api';

type AdminBlogPostEditorProps = {
  error?: string;
  value: BlogPostContentJson;
  onChange: (value: {
    contentHtml: string;
    contentJson: BlogPostContentJson;
  }) => void;
};

const editorExtensions = [
  StarterKit,
  LinkExtension.configure({
    openOnClick: false,
  }),
];

const isSameContent = (
  left: BlogPostContentJson,
  right: BlogPostContentJson,
) => JSON.stringify(left) === JSON.stringify(right);

export const AdminBlogPostEditor = ({
  error,
  onChange,
  value,
}: AdminBlogPostEditorProps) => {
  const editor = useEditor({
    extensions: editorExtensions,
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-72 rounded-b border-x border-b border-border-strong bg-background-surface px-4 py-3 block-medium text-typography-primary outline-none [&_blockquote]:border-l-4 [&_blockquote]:border-border-strong [&_blockquote]:pl-3 [&_blockquote]:text-typography-secondary [&_h2]:block-title [&_h2]:text-typography-heading [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange({
        contentHtml: editor.getHTML(),
        contentJson: editor.getJSON() as BlogPostContentJson,
      });
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getJSON() as BlogPostContentJson;

    if (isSameContent(currentContent, value)) return;

    editor.commands.setContent(value, { emitUpdate: false });
  }, [
    editor,
    value,
  ]);

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', previousUrl ?? '');

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const isDisabled = !editor;

  return (
    <div className="flex flex-col gap-2">
      <label className="block-medium text-typography-heading">
        Content
      </label>
      <div
        className={`rounded border ${
          error ? 'border-red-600' : 'border-border-strong'
        }`}
      >
        <div className="flex flex-wrap gap-1 rounded-t border-b border-border-soft bg-background-secondary p-2">
          <Button
            disabled={isDisabled}
            size="sm"
            type="button"
            variant={editor?.isActive('bold') ? 'primary' : 'secondary'}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            B
          </Button>
          <Button
            disabled={isDisabled}
            size="sm"
            type="button"
            variant={editor?.isActive('italic') ? 'primary' : 'secondary'}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            I
          </Button>
          <Button
            disabled={isDisabled}
            size="sm"
            type="button"
            variant={editor?.isActive('heading', { level: 2 }) ? 'primary' : 'secondary'}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </Button>
          <Button
            disabled={isDisabled}
            size="sm"
            type="button"
            variant={editor?.isActive('bulletList') ? 'primary' : 'secondary'}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            UL
          </Button>
          <Button
            disabled={isDisabled}
            size="sm"
            type="button"
            variant={editor?.isActive('orderedList') ? 'primary' : 'secondary'}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            OL
          </Button>
          <Button
            disabled={isDisabled}
            size="sm"
            type="button"
            variant={editor?.isActive('blockquote') ? 'primary' : 'secondary'}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            Quote
          </Button>
          <Button
            disabled={isDisabled}
            size="sm"
            type="button"
            variant={editor?.isActive('link') ? 'primary' : 'secondary'}
            onClick={setLink}
          >
            Link
          </Button>
        </div>
        <EditorContent editor={editor} />
      </div>
      {error && <p className="block-small text-red-600">{error}</p>}
    </div>
  );
};
