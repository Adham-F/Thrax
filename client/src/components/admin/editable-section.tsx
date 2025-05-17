import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminEdit } from "@/contexts/admin-edit-context";
import { Pencil, Check, X, FileText, Eye } from "lucide-react";

interface EditableSectionProps {
  id: string;
  title: string;
  path: string;
  content: string;
  description?: string;
  className?: string;
}

/**
 * A more comprehensive editable section component
 * This is designed for larger content blocks like help pages, legal documents, etc.
 */
export function EditableSection({
  id,
  title,
  path,
  content,
  description,
  className = "",
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const { isEditMode, updateContent, editableContent } = useAdminEdit();
  
  // Get the current content from context if available
  const currentContent = editableContent.find(item => item.id === id)?.content || content;
  
  // Register this content when the component starts editing
  const startEditing = () => {
    setIsEditing(true);
    setEditContent(currentContent);
  };
  
  // Save changes and exit editing mode
  const saveChanges = () => {
    updateContent(id, editContent);
    setIsEditing(false);
  };
  
  // Discard changes and exit editing mode
  const cancelEditing = () => {
    setEditContent(currentContent);
    setIsEditing(false);
  };
  
  if (!isEditMode) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: currentContent }} />
        </CardContent>
      </Card>
    );
  }
  
  if (isEditing) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Editing: {title}</CardTitle>
          <CardDescription>Path: {path}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="edit">
            <TabsList className="mb-4">
              <TabsTrigger value="edit"><FileText className="w-4 h-4 mr-2" /> Edit</TabsTrigger>
              <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-2" /> Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit">
              <Textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </TabsContent>
            
            <TabsContent value="preview">
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div dangerouslySetInnerHTML={{ __html: editContent }} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <div className="flex items-center gap-2 mt-4">
            <Button 
              onClick={saveChanges}
              variant="default"
            >
              <Check className="h-4 w-4 mr-2" /> Save Changes
            </Button>
            <Button 
              onClick={cancelEditing}
              variant="outline"
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto"
            onClick={startEditing}
          >
            <Pencil className="h-4 w-4 mr-2" /> Edit Content
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-dashed border-primary/40 p-4 rounded">
          <div dangerouslySetInnerHTML={{ __html: currentContent }} />
        </div>
      </CardContent>
    </Card>
  );
}