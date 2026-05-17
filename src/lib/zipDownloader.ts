/**
 * ZIP Downloader Utility
 * 
 * Creates and downloads ZIP files containing folder structures with content.
 * Browser-only module - will throw error if used in SSR context.
 */

import JSZip from 'jszip';

/**
 * Interface representing a folder or file in the structure
 */
export interface FolderNode {
  name: string;
  type: 'folder' | 'file';
  children?: FolderNode[];
  content?: string; // Optional content for files
}

/**
 * Recursively adds folders and files to a JSZip instance
 * @param zip - The JSZip instance or folder
 * @param node - The current folder/file node to process
 * @param currentPath - The current path in the zip structure
 */
const addToZip = (zip: JSZip, node: FolderNode, currentPath: string = ''): void => {
  const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name;

  if (node.type === 'folder') {
    // Create folder
    const folder = zip.folder(nodePath);
    
    if (!folder) {
      console.warn(`Failed to create folder: ${nodePath}`);
      return;
    }

    // Process children if they exist
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        addToZip(zip, child, nodePath);
      });
    } else {
      // Add a .gitkeep file to empty folders so they're preserved
      folder.file('.gitkeep', '');
    }
  } else if (node.type === 'file') {
    // Add file with content (use provided content or generate dummy content)
    const fileContent = node.content || generateDummyContent(node.name);
    zip.file(nodePath, fileContent);
  }
};

/**
 * Generates dummy content based on file extension
 * @param fileName - The name of the file
 * @returns Dummy content string
 */
const generateDummyContent = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? 'txt';

  switch (extension) {
    case 'ts':
    case 'tsx':
      return `// ${fileName}\n// TODO: Implement this TypeScript file\n\nexport {};\n`;
    
    case 'js':
    case 'jsx':
      return `// ${fileName}\n// TODO: Implement this JavaScript file\n\nexport {};\n`;
    
    case 'css':
      return `/* ${fileName} */\n/* TODO: Add styles */\n`;
    
    case 'json':
      return `{\n  "name": "${fileName}",\n  "description": "TODO: Configure this file"\n}\n`;
    
    case 'md':
      return `# ${fileName}\n\nTODO: Add documentation\n`;
    
    case 'html':
      return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${fileName}</title>\n</head>\n<body>\n  <!-- TODO: Add content -->\n</body>\n</html>\n`;
    
    case 'py':
      return `# ${fileName}\n# TODO: Implement this Python file\n\nif __name__ == "__main__":\n    pass\n`;
    
    case 'java':
      return `// ${fileName}\n// TODO: Implement this Java file\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO\n    }\n}\n`;
    
    case 'php':
      return `<?php\n// ${fileName}\n// TODO: Implement this PHP file\n\n?>\n`;
    
    case 'sql':
      return `-- ${fileName}\n-- TODO: Add SQL queries\n\n`;
    
    case 'env':
      return `# ${fileName}\n# TODO: Add environment variables\n\n`;
    
    case 'gitignore':
      return `# ${fileName}\nnode_modules/\n.env\n*.log\n`;
    
    default:
      return `# ${fileName}\nTODO: Add content for this file\n`;
  }
};

/**
 * Converts a nested object map to FolderNode array format
 * @param jsonObj - Nested object where keys are names and values are either strings (file content) or objects (folders)
 * @returns Array of FolderNode objects
 *
 * @example
 * const input = {
 *   "src": {
 *     "domain": {
 *       "User.ts": "export class User { }",
 *       "Product.ts": "export class Product { }"
 *     },
 *     "utils": {
 *       "helpers.ts": "export const helper = () => { }"
 *     }
 *   },
 *   "README.md": "# My Project"
 * };
 *
 * const nodes = adaptJsonToFolderNodes(input);
 * // Result: [
 * //   { name: 'src', type: 'folder', children: [...] },
 * //   { name: 'README.md', type: 'file', content: '# My Project' }
 * // ]
 */
export function adaptJsonToFolderNodes(jsonObj: Record<string, any>): FolderNode[] {
  const nodes: FolderNode[] = [];

  for (const [key, value] of Object.entries(jsonObj)) {
    if (typeof value === 'string') {
      // It's a file - the value is the content
      nodes.push({
        name: key,
        type: 'file',
        content: value
      });
    } else if (typeof value === 'object' && value !== null) {
      // It's a folder - recursively process children
      const children = adaptJsonToFolderNodes(value);
      nodes.push({
        name: key,
        type: 'folder',
        children: children.length > 0 ? children : undefined
      });
    } else {
      // Handle edge cases (null, undefined, etc.)
      console.warn(`Skipping invalid entry: ${key} with value:`, value);
    }
  }

  return nodes;
}

/**
 * Downloads a zip file containing the folder structure
 * 
 * ⚠️ BROWSER-ONLY: This function uses DOM APIs and will throw an error in SSR context.
 * 
 * @param folderStructure - JSON object representing the folder tree
 * @param zipFileName - Optional custom name for the zip file (default: 'blueprint.zip')
 * @throws {Error} If called in a non-browser environment (SSR)
 */
export const downloadZip = async (
  folderStructure: FolderNode | FolderNode[],
  zipFileName: string = 'blueprint.zip'
): Promise<void> => {
  // SSR Safety Check - Critical Issue #5 Fix
  if (typeof window === 'undefined') {
    throw new Error(
      'downloadZip() can only be called in browser environment. ' +
      'This function uses DOM APIs (document, URL.createObjectURL) which are not available during SSR.'
    );
  }

  try {
    // Create a new JSZip instance
    const zip = new JSZip();

    // Handle both single node and array of nodes
    const nodes = Array.isArray(folderStructure) ? folderStructure : [folderStructure];

    // Add all nodes to the zip
    nodes.forEach(node => {
      addToZip(zip, node);
    });

    // Generate the zip file as a blob
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9 // Maximum compression
      }
    });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = zipFileName;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating zip file:', error);
    throw new Error(`Failed to create zip file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Example usage:
 * 
 * const folderStructure = {
 *   name: 'my-project',
 *   type: 'folder',
 *   children: [
 *     {
 *       name: 'src',
 *       type: 'folder',
 *       children: [
 *         { name: 'index.ts', type: 'file' },
 *         { name: 'utils.ts', type: 'file' }
 *       ]
 *     },
 *     { name: 'README.md', type: 'file', content: '# My Project\n\nCustom content here' }
 *   ]
 * };
 * 
 * await downloadZip(folderStructure, 'my-project.zip');
 *
 * // Or use with the adapter for nested object format:
 * const nestedJson = {
 *   "src": {
 *     "index.ts": "console.log('Hello');",
 *     "utils": {
 *       "helper.ts": "export const help = () => {}"
 *     }
 *   }
 * };
 * const nodes = adaptJsonToFolderNodes(nestedJson);
 * await downloadZip(nodes, 'my-project.zip');
 */

// Made with Bob
