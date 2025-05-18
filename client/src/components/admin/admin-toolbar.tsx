import { useAdminEdit } from "@/contexts/admin-edit-context";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Pencil,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Settings,
  Home,
  ShoppingBag,
  Users,
  FileText,
  Mail
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function AdminToolbar() {
  const { user } = useAuth();
  const {
    isEditMode,
    toggleEditMode,
    saveChanges,
    discardChanges,
    isSaving
  } = useAdminEdit();
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  // TEMPORARY FIX: Always show the admin toolbar when logged in
  // This is a quick fix to ensure the admin toolbar is visible
  console.log("AdminToolbar - User:", user);
  
  // Simply check if user exists (logged in)
  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {!isCollapsed && (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-primary font-bold">THRAX Admin Panel</span>
                <Separator orientation="vertical" className="h-6" />
                
                {isEditMode ? (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={toggleEditMode}
                    >
                      <X className="h-4 w-4 mr-2" /> Exit Edit Mode
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={saveChanges}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" /> 
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={discardChanges}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" /> Discard Changes
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={toggleEditMode}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Edit Content
                  </Button>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" /> Admin Menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Admin Pages</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                        <Home className="h-4 w-4 mr-2" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/products">
                        <ShoppingBag className="h-4 w-4 mr-2" /> Products
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users">
                        <Users className="h-4 w-4 mr-2" /> Users
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/help-pages">
                        <FileText className="h-4 w-4 mr-2" /> Help Pages
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/newsletters">
                        <Mail className="h-4 w-4 mr-2" /> Newsletters
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className={isCollapsed ? "mx-auto" : ""}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}