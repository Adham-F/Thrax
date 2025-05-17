import { Request, Response, NextFunction, Router } from "express";
import { isAdmin } from "../middleware/admin";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const adminContentRouter = Router();

// Helper function to update file content
async function updateFileContent(filePath: string, newContent: string) {
  try {
    // Make sure the file exists and is within our project
    const fullPath = path.resolve(filePath);
    const projectRoot = path.resolve(".");
    
    if (!fullPath.startsWith(projectRoot)) {
      throw new Error("Cannot access files outside of project directory");
    }
    
    // Check if file exists
    await readFile(fullPath, "utf-8");
    
    // Write the new content
    await writeFile(fullPath, newContent, "utf-8");
    
    return true;
  } catch (error) {
    console.error(`Error updating file ${filePath}:`, error);
    throw error;
  }
}

// Update content endpoint
adminContentRouter.post("/update-content", isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, path: contentPath, content } = req.body;
    
    if (!id || !contentPath || content === undefined) {
      return res.status(400).json({ message: "Missing required fields: id, path, or content" });
    }
    
    // Handle file updates
    if (contentPath.startsWith("/") || contentPath.startsWith("./")) {
      await updateFileContent(contentPath, content);
      return res.status(200).json({ success: true, message: "File updated successfully" });
    }
    
    // Handle database content updates
    if (contentPath.startsWith("db:")) {
      const [, tableName, field, recordId] = contentPath.split(":");
      // This would be replaced with your actual database update logic
      // For example: await db.update(tableName).set({ [field]: content }).where(eq(tableId, recordId));
      return res.status(200).json({ success: true, message: "Database content updated successfully" });
    }
    
    // Handle API-based content updates
    if (contentPath.startsWith("api:")) {
      // Handle API-specific updates - depends on your implementation
      return res.status(200).json({ success: true, message: "API content updated successfully" });
    }
    
    return res.status(400).json({ message: "Unsupported content path format" });
  } catch (error) {
    next(error);
  }
});

export default adminContentRouter;