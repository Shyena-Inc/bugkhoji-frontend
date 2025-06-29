
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState('edit');

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering for preview
    return text
      .replace(/### (.*)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/## (.*)/g, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/# (.*)/g, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br>');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="edit" className="mt-2">
        <Textarea
          placeholder={placeholder}
          className="min-h-[200px]"
          value={value}
          onChange={handleInputChange}
          required
        />
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Supports Markdown: **bold**, *italic*, `code`, ### headings
        </p>
      </TabsContent>
      
      <TabsContent value="preview" className="mt-2">
        <div 
          className="min-h-[200px] p-3 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MarkdownEditor;
