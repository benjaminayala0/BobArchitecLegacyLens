export interface FolderNode {
    name: string;
    type: "folder" | "file";
    children?: FolderNode[];
    content?: string;
}

/**
 * Adapts the suggested_folder_structure from IBM Bob JSON to FolderNode format
 */
export function adaptJsonToFolderNodes(suggestedStructure: unknown): FolderNode {
  if (!suggestedStructure) {
    return {
      name: "modernized-project",
      type: "folder",
      children: [],
    };
  }

  // If the structure is already in the correct format, return it
  const structure = suggestedStructure as Record<string, unknown>;
  if (structure.name && structure.type) {
    return structure as unknown as FolderNode;
  }

  // Otherwise, create a default structure
  return {
    name: "modernized-project",
    type: "folder",
    children: Object.entries(structure).map(([key, value]) => ({
      name: key,
      type: typeof value === "object" ? "folder" : "file",
      children: typeof value === "object" ? [] : undefined,
      content: typeof value === "string" ? value : undefined,
    })) as FolderNode[],
  };
}

/**
 * Downloads the folder structure as a ZIP file
 */
export async function downloadZip(folderStructure: FolderNode): Promise<void> {
    try {
        // Dynamic import of JSZip to avoid bundling it if not used
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();

        function addToZip(node: FolderNode, currentPath: string = "") {
            const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;

            if (node.type === "folder" && node.children) {
                // Create folder
                zip.folder(fullPath);
                // Add children
                node.children.forEach((child) => addToZip(child, fullPath));
            } else if (node.type === "file") {
                // Add file with content
                zip.file(fullPath, node.content || "// Generated file\n");
            }
        }

        addToZip(folderStructure);

        // Generate and download
        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${folderStructure.name}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error generating ZIP:", error);
        throw new Error("Failed to generate ZIP file");
    }
}

// Made with Bob
