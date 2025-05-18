import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type EditableContentMap = Record<string, string>;

interface AdminEditContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  editableContent: EditableContentMap;
  setEditableContent: (path: string, content: string) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  isSaving: boolean;
}

const AdminEditContext = createContext<AdminEditContextType | undefined>(undefined);

export const AdminEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableContent, setEditableContentState] = useState<EditableContentMap>({});
  const [originalContent, setOriginalContent] = useState<EditableContentMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Toggle edit mode
  const toggleEditMode = () => {
    // If turning off edit mode without saving, revert to original content
    if (isEditMode) {
      setEditableContentState(originalContent);
    } else {
      // When turning on edit mode, save the current state to revert to later if needed
      setOriginalContent({ ...editableContent });
    }
    setIsEditMode(!isEditMode);
  };

  // Set editable content for a specific path
  const setEditableContent = (path: string, content: string) => {
    setEditableContentState((prev) => ({ ...prev, [path]: content }));
  };

  // Save changes to the server
  const saveChanges = async () => {
    try {
      setIsSaving(true);
      
      // For each path in the editableContent, send a request to the server
      const updatePromises = Object.entries(editableContent).map(async ([path, content]) => {
        // Skip if the content hasn't changed
        if (content === originalContent[path]) {
          return;
        }

        // Parse the path to determine how to save the content
        // Format: <type>:<collection>:<field>:<id>
        const pathParts = path.split(':');
        const type = pathParts[0];
        
        // Different endpoints based on the type of content
        if (type === 'db') {
          // Database stored content
          const collection = pathParts[1];
          const field = pathParts[2];
          const id = pathParts[3];
          
          await apiRequest('POST', '/api/admin/content/update', {
            type,
            collection,
            field,
            id,
            content
          });
        } else if (type === 'file') {
          // File stored content
          const filePath = pathParts.slice(1).join(':');
          
          await apiRequest('POST', '/api/admin/content/update', {
            type,
            path: filePath,
            content
          });
        }
      });

      await Promise.all(updatePromises);
      
      // Update the original content to match the current state
      setOriginalContent({ ...editableContent });
      
      // Turn off edit mode
      setIsEditMode(false);
      
      toast({
        title: 'Changes Saved',
        description: 'Your content updates have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error Saving Changes',
        description: 'There was a problem saving your content updates. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Discard changes and revert to original content
  const discardChanges = () => {
    setEditableContentState(originalContent);
    setIsEditMode(false);
    
    toast({
      title: 'Changes Discarded',
      description: 'Your content updates have been discarded.',
    });
  };

  return (
    <AdminEditContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        editableContent,
        setEditableContent,
        saveChanges,
        discardChanges,
        isSaving
      }}
    >
      {children}
    </AdminEditContext.Provider>
  );
};

export const useAdminEdit = (): AdminEditContextType => {
  const context = useContext(AdminEditContext);
  if (context === undefined) {
    throw new Error('useAdminEdit must be used within an AdminEditProvider');
  }
  return context;
};