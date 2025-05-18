import React from 'react';
import { useAdminEdit } from '@/contexts/admin-edit-context';

interface EditableTextProps {
  id: string;
  path: string;
  children: React.ReactNode;
  className?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  path,
  children,
  className = '',
}) => {
  const { isEditMode, editableContent, setEditableContent } = useAdminEdit();

  // Get the content from the editable content map, or use the provided children as default
  const content = typeof editableContent[path] !== 'undefined' 
    ? editableContent[path] 
    : typeof children === 'string' 
      ? children 
      : '';

  // Update content in the editable content map when in edit mode
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(path, e.target.value);
  };

  if (isEditMode) {
    return (
      <textarea
        id={id}
        className={`min-h-[80px] w-full px-3 py-2 rounded-md border border-input bg-background ${className}`}
        value={content}
        onChange={handleContentChange}
      />
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
};