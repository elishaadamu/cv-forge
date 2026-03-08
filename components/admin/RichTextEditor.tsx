"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { TextAlign } from '@tiptap/extension-text-align'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Type,
  Baseline,
  Eraser
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Start typing..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-8 py-8 font-bold text-foreground/80 leading-relaxed',
      },
    },
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  const MenuButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: { 
    onClick: () => void, 
    isActive?: boolean, 
    disabled?: boolean, 
    children: React.ReactNode,
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center border ${
        isActive 
        ? 'bg-brand-action/10 border-brand-action/30 text-brand-action shadow-inner' 
        : 'bg-secondary/20 border-border-custom text-muted-foreground hover:text-foreground hover:bg-secondary/40'
      } disabled:opacity-30`}
    >
      {children}
    </button>
  )

  return (
    <div className="flex flex-col w-full bg-secondary/30 border border-border-custom rounded-[32px] overflow-hidden focus-within:border-brand-action/30 transition-all shadow-inner">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-border-custom bg-secondary/50 backdrop-blur-3xl shrink-0">
        <div className="flex items-center gap-1.5 px-2 border-r border-border-custom mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1.5 px-2 border-r border-border-custom mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1.5 px-2 border-r border-border-custom mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1.5 px-2 border-r border-border-custom mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1.5 px-2 border-r border-border-custom mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().setColor('#D7FF00').run()}
            isActive={editor.isActive('textStyle', { color: '#D7FF00' })}
            title="Brand Action Color"
          >
            <Baseline size={16} className="text-brand-action" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setColor('#FFFFFF').run()}
            isActive={editor.isActive('textStyle', { color: '#FFFFFF' })}
            title="White"
          >
            <Baseline size={16} className="text-white" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().unsetColor().run()}
            title="Reset Color"
          >
            <Eraser size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1.5 px-2 border-r border-border-custom mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight size={16} />
          </MenuButton>
        </div>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={16} />
        </MenuButton>
      </div>

      {/* Editor Content */}
      <div className="relative bg-card/10 flex-1 min-h-0">
        <EditorContent editor={editor} />
        
        {/* Floating Indicator */}
        <div className="absolute bottom-5 right-8 px-4 py-1.5 bg-brand-action/10 border border-brand-action/20 rounded-full flex items-center gap-2 pointer-events-none opacity-50">
           <div className="w-1.5 h-1.5 rounded-full bg-brand-action animate-pulse" />
           <span className="text-[8px] font-black uppercase tracking-widest text-brand-action">Rich Engine Live</span>
        </div>
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(var(--muted-foreground-rgb), 0.2);
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          outline: none;
        }
        .ProseMirror h1 { font-size: 2.5rem; line-height: 1; margin-bottom: 2rem; }
        .ProseMirror h2 { font-size: 1.8rem; line-height: 1.2; margin-bottom: 1.5rem; }
        .ProseMirror h3 { font-size: 1.4rem; font-weight: 900; line-height: 1.4; margin-bottom: 1rem; }
        .ProseMirror p { margin-bottom: 1rem; font-weight: 700; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .ProseMirror blockquote { border-left: 4px solid rgba(var(--brand-action-rgb), 0.4); padding-left: 1.5rem; font-style: italic; color: rgba(var(--foreground-rgb), 0.6); }
      `}</style>
    </div>
  )
}
