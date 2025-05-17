import { useState, useEffect, ReactNode } from "react";
import { useAdminEdit, ContentType } from "@/contexts/admin-edit-context";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";

interface EditableContentProps {
  id: string;
  path: string;
  type: ContentType;
  location?: string;
  children: ReactNode | string;
  className?: string;
}

export function EditableContent({
  id,
  path,
  type,
  location,
  children,
  className = "",
}: EditableContentProps) {
  const { 
    isEditMode,
    registerEditableContent,
    unregisterEditableContent,
    updateContent,
    editableContent
  } = useAdminEdit();
  
  const [isEditing, setIsEditing] = useState(false);
  const content = typeof children === "string" ? children : "";
  
  // Register this content when the component mounts
  useEffect(() => {
    const fullContent = typeof children === "string" ? children : "";
    
    registerEditableContent({
      id,
      path,
      type,
      content: fullContent,
      location,
    });
    
    return () => unregisterEditableContent(id);
  }, [id, path, type, location, children, registerEditableContent, unregisterEditableContent]);
  
  // Find the current content in the context
  const currentContent = editableContent.find(item => item.id === id)?.content || content;
  
  if (!isEditMode) {
    return <>{children}</>;
  }
  
  if (isEditing) {
    return (
      <Card className="p-2 relative">
        <Textarea
          value={currentContent}
          onChange={(e) => updateContent(id, e.target.value)}
          className="min-h-[100px] resize-y"
        />
        <div className="flex items-center gap-2 mt-2">
          <Button 
            size="sm" 
            onClick={() => setIsEditing(false)}
            variant="default"
          >
            <Check className="h-4 w-4 mr-1" /> Done
          </Button>
          <Button 
            size="sm" 
            onClick={() => {
              updateContent(id, content);
              setIsEditing(false);
            }}
            variant="outline"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Path: {path}
        </div>
      </Card>
    );
  }
  
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
      <div className="border border-dashed border-primary/40 p-1 min-h-[20px] rounded-sm">
        {/* Use dangerouslySetInnerHTML for string content to avoid nesting issues */}
        {typeof children === "string" ? 
          <div dangerouslySetInnerHTML={{ __html: currentContent }} /> : 
          children
        }
      </div>
    </div>
  );
}

// Specialized components for different content types
export function EditableText(props: Omit<EditableContentProps, "type">) {
  return <EditableContent {...props} type="text" />;
}

export function EditableHTML(props: Omit<EditableContentProps, "type">) {
  return <EditableContent {...props} type="html" />;
}

export function EditableImage(props: Omit<EditableContentProps, "type">) {
  return <EditableContent {...props} type="image" />;
}