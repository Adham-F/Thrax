import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Types of content that can be edited
export type ContentType = "text" | "html" | "image" | "component";

// Type for an editable content field
export interface EditableContent {
  id: string;
  path: string; // File path or API endpoint for updating this content
  type: ContentType;
  content: string;
  location?: string; // Optional metadata about location in the app
}

// Admin edit mode context
interface AdminEditContextProps {
  isEditMode: boolean;
  toggleEditMode: () => void;
  editableContent: EditableContent[];
  registerEditableContent: (content: EditableContent) => void;
  unregisterEditableContent: (id: string) => void;
  updateContent: (id: string, newContent: string) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  isSaving: boolean;
}

const AdminEditContext = createContext<AdminEditContextProps | undefined>(undefined);

export function AdminEditProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState<EditableContent[]>([]);
  const [originalContent, setOriginalContent] = useState<Record<string, string>>({});
  
  // Save changes mutation
  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: async (updates: { id: string; content: string; path: string }[]) => {
      return await Promise.all(
        updates.map(update => 
          apiRequest("POST", "/api/admin/update-content", update)
        )
      );
    },
    onSuccess: () => {
      toast({
        title: "Changes saved",
        description: "Your content updates have been saved successfully.",
      });
      // Update original content after save
      const newOriginals: Record<string, string> = {};
      editableContent.forEach(item => {
        newOriginals[item.id] = item.content;
      });
      setOriginalContent(newOriginals);
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save changes",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Toggle edit mode
  const toggleEditMode = () => {
    if (!isEditMode) {
      // Entering edit mode - store original content
      const originals: Record<string, string> = {};
      editableContent.forEach(item => {
        originals[item.id] = item.content;
      });
      setOriginalContent(originals);
      setIsEditMode(true);
    } else {
      // Exiting edit mode - ask if they want to save changes
      setIsEditMode(false);
    }
  };

  // Register editable content
  const registerEditableContent = (content: EditableContent) => {
    setEditableContent(prev => {
      // If this ID already exists, replace it
      const exists = prev.some(item => item.id === content.id);
      if (exists) {
        return prev.map(item => 
          item.id === content.id ? content : item
        );
      }
      // Otherwise add it
      return [...prev, content];
    });
  };

  // Unregister editable content
  const unregisterEditableContent = (id: string) => {
    setEditableContent(prev => prev.filter(item => item.id !== id));
  };

  // Update content
  const updateContent = (id: string, newContent: string) => {
    setEditableContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, content: newContent } : item
      )
    );
  };

  // Save all changes
  const saveChanges = async () => {
    // Only save items that have changed
    const changedItems = editableContent.filter(
      item => originalContent[item.id] !== item.content
    );
    
    if (changedItems.length === 0) {
      toast({
        title: "No changes to save",
        description: "No content has been modified.",
      });
      return;
    }
    
    // Prepare updates for the mutation
    const updates = changedItems.map(item => ({
      id: item.id,
      content: item.content,
      path: item.path,
    }));
    
    mutate(updates);
  };

  // Discard all changes
  const discardChanges = () => {
    setEditableContent(prev => 
      prev.map(item => ({
        ...item,
        content: originalContent[item.id] || item.content
      }))
    );
    
    toast({
      title: "Changes discarded",
      description: "All content changes have been reverted.",
    });
    
    setIsEditMode(false);
  };

  // Only provide edit functionality to admins
  if (!user?.isAdmin) {
    return <>{children}</>;
  }

  return (
    <AdminEditContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        editableContent,
        registerEditableContent,
        unregisterEditableContent,
        updateContent,
        saveChanges,
        discardChanges,
        isSaving,
      }}
    >
      {children}
    </AdminEditContext.Provider>
  );
}

export function useAdminEdit() {
  const context = useContext(AdminEditContext);
  if (context === undefined) {
    throw new Error("useAdminEdit must be used within an AdminEditProvider");
  }
  return context;
}