"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import '@/styles/editor.css'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Heading1,
  Heading2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  const buttonClass = "h-8 w-8 p-0"

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 rounded-t-md">
      {/* Undo/Redo */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={buttonClass}
        title="تراجع"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={buttonClass}
        title="إعادة"
      >
        <Redo className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Text Formatting */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          buttonClass,
          editor.isActive('bold') && 'bg-gray-200'
        )}
        title="غامق"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          buttonClass,
          editor.isActive('italic') && 'bg-gray-200'
        )}
        title="مائل"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          buttonClass,
          editor.isActive('underline') && 'bg-gray-200'
        )}
        title="تسطير"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Headings */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          buttonClass,
          editor.isActive('heading', { level: 1 }) && 'bg-gray-200'
        )}
        title="عنوان 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          buttonClass,
          editor.isActive('heading', { level: 2 }) && 'bg-gray-200'
        )}
        title="عنوان 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Lists */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          buttonClass,
          editor.isActive('bulletList') && 'bg-gray-200'
        )}
        title="قائمة نقطية"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          buttonClass,
          editor.isActive('orderedList') && 'bg-gray-200'
        )}
        title="قائمة مرقمة"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Text Alignment */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={cn(
          buttonClass,
          editor.isActive({ textAlign: 'left' }) && 'bg-gray-200'
        )}
        title="محاذاة لليسار"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={cn(
          buttonClass,
          editor.isActive({ textAlign: 'center' }) && 'bg-gray-200'
        )}
        title="محاذاة للوسط"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={cn(
          buttonClass,
          editor.isActive({ textAlign: 'right' }) && 'bg-gray-200'
        )}
        title="محاذاة لليمين"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={cn(
          buttonClass,
          editor.isActive({ textAlign: 'justify' }) && 'bg-gray-200'
        )}
        title="ضبط"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function RichTextEditor({ value, onChange, placeholder, disabled }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value || '',
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
  })

  // Update editor content when value prop changes externally
  if (editor && value !== editor.getHTML()) {
    editor.commands.setContent(value || '')
  }

  // Update editable state when disabled prop changes
  if (editor && editor.isEditable === disabled) {
    editor.setEditable(!disabled)
  }

  return (
    <div className={cn(
      "border rounded-md overflow-hidden bg-white",
      disabled && "opacity-60 cursor-not-allowed"
    )}>
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className={cn(
          "prose prose-sm max-w-none p-3 min-h-[150px] focus:outline-none",
          "prose-headings:my-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1",
          "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[150px]",
          "[&_.ProseMirror]:focus:outline-none",
          "[&_.ProseMirror]:text-right [&_.ProseMirror]:dir-rtl",
          disabled && "pointer-events-none"
        )}
        placeholder={placeholder}
      />
    </div>
  )
}
