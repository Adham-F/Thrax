import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminEdit } from '@/contexts/admin-edit-context';

interface EditableSectionProps {
  id: string;
  title?: string;
  description?: string;
  content: string;
  path: string;
  className?: string;
}

export const EditableSection: React.FC<EditableSectionProps> = ({
  id,
  title,
  description,
  content,
  path,
  className = '',
}) => {
  const { isEditMode, editableContent, setEditableContent } = useAdminEdit();

  // Get the content from the editable content map, or use the provided content as default
  const currentContent = editableContent[path] || content;

  // Update content in the editable content map when in edit mode
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(path, e.target.value);
  };

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {isEditMode ? (
          <textarea
            id={id}
            className="w-full h-[400px] px-3 py-2 rounded-md border border-input bg-background font-mono text-sm"
            value={currentContent}
            onChange={handleContentChange}
          />
        ) : (
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentContent }}
          />
        )}
      </CardContent>
    </Card>
  );
};