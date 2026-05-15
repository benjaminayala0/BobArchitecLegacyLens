/**
 * Example usage of the downloadZip utility
 * This file demonstrates various ways to use the zip downloader
 */

import { downloadZip } from './zipDownloader';

// Example 1: Simple folder structure
export const example1_SimpleStructure = async () => {
  const folderStructure = {
    name: 'my-app',
    type: 'folder' as const,
    children: [
      {
        name: 'src',
        type: 'folder' as const,
        children: [
          { name: 'index.ts', type: 'file' as const },
          { name: 'app.ts', type: 'file' as const }
        ]
      },
      { name: 'README.md', type: 'file' as const }
    ]
  };

  await downloadZip(folderStructure, 'simple-app.zip');
};

// Example 2: Complex nested structure with custom content
export const example2_ComplexStructure = async () => {
  const folderStructure = {
    name: 'full-stack-app',
    type: 'folder' as const,
    children: [
      {
        name: 'frontend',
        type: 'folder' as const,
        children: [
          {
            name: 'src',
            type: 'folder' as const,
            children: [
              {
                name: 'components',
                type: 'folder' as const,
                children: [
                  { name: 'Header.tsx', type: 'file' as const },
                  { name: 'Footer.tsx', type: 'file' as const }
                ]
              },
              { name: 'App.tsx', type: 'file' as const },
              { name: 'index.tsx', type: 'file' as const }
            ]
          },
          {
            name: 'public',
            type: 'folder' as const,
            children: [
              { name: 'index.html', type: 'file' as const }
            ]
          },
          {
            name: 'package.json',
            type: 'file' as const,
            content: JSON.stringify({
              name: 'frontend',
              version: '1.0.0',
              dependencies: {
                react: '^18.0.0'
              }
            }, null, 2)
          }
        ]
      },
      {
        name: 'backend',
        type: 'folder' as const,
        children: [
          {
            name: 'src',
            type: 'folder' as const,
            children: [
              { name: 'server.ts', type: 'file' as const },
              { name: 'routes.ts', type: 'file' as const }
            ]
          },
          {
            name: 'package.json',
            type: 'file' as const,
            content: JSON.stringify({
              name: 'backend',
              version: '1.0.0',
              dependencies: {
                express: '^4.18.0'
              }
            }, null, 2)
          }
        ]
      },
      {
        name: 'README.md',
        type: 'file' as const,
        content: '# Full Stack Application\n\nThis is a full-stack application with frontend and backend.\n\n## Setup\n\n1. Install dependencies\n2. Run the app\n'
      },
      {
        name: '.gitignore',
        type: 'file' as const,
        content: 'node_modules/\n.env\n*.log\ndist/\nbuild/\n'
      }
    ]
  };

  await downloadZip(folderStructure, 'full-stack-app.zip');
};

// Example 3: Multiple root folders (array format)
export const example3_MultipleRoots = async () => {
  const folderStructures = [
    {
      name: 'project-1',
      type: 'folder' as const,
      children: [
        { name: 'index.js', type: 'file' as const }
      ]
    },
    {
      name: 'project-2',
      type: 'folder' as const,
      children: [
        { name: 'main.py', type: 'file' as const }
      ]
    }
  ];

  await downloadZip(folderStructures, 'multiple-projects.zip');
};

// Example 4: Empty folders (will include .gitkeep)
export const example4_EmptyFolders = async () => {
  const folderStructure = {
    name: 'project-with-empty-folders',
    type: 'folder' as const,
    children: [
      {
        name: 'src',
        type: 'folder' as const,
        children: [] // Empty folder
      },
      {
        name: 'tests',
        type: 'folder' as const,
        children: [] // Empty folder
      },
      { name: 'README.md', type: 'file' as const }
    ]
  };

  await downloadZip(folderStructure);
};

// Example 5: Various file types with auto-generated content
export const example5_VariousFileTypes = async () => {
  const folderStructure = {
    name: 'multi-language-project',
    type: 'folder' as const,
    children: [
      { name: 'script.ts', type: 'file' as const },
      { name: 'script.js', type: 'file' as const },
      { name: 'styles.css', type: 'file' as const },
      { name: 'config.json', type: 'file' as const },
      { name: 'docs.md', type: 'file' as const },
      { name: 'index.html', type: 'file' as const },
      { name: 'script.py', type: 'file' as const },
      { name: 'Main.java', type: 'file' as const },
      { name: 'index.php', type: 'file' as const },
      { name: 'schema.sql', type: 'file' as const },
      { name: '.env', type: 'file' as const },
      { name: '.gitignore', type: 'file' as const }
    ]
  };

  await downloadZip(folderStructure, 'multi-language.zip');
};

// Example 6: Real-world Next.js project structure
export const example6_NextJsProject = async () => {
  const folderStructure = {
    name: 'nextjs-app',
    type: 'folder' as const,
    children: [
      {
        name: 'src',
        type: 'folder' as const,
        children: [
          {
            name: 'app',
            type: 'folder' as const,
            children: [
              { name: 'layout.tsx', type: 'file' as const },
              { name: 'page.tsx', type: 'file' as const },
              { name: 'globals.css', type: 'file' as const }
            ]
          },
          {
            name: 'components',
            type: 'folder' as const,
            children: [
              { name: 'Header.tsx', type: 'file' as const },
              { name: 'Footer.tsx', type: 'file' as const }
            ]
          },
          {
            name: 'lib',
            type: 'folder' as const,
            children: [
              { name: 'utils.ts', type: 'file' as const }
            ]
          }
        ]
      },
      {
        name: 'public',
        type: 'folder' as const,
        children: [
          { name: 'favicon.ico', type: 'file' as const }
        ]
      },
      { name: 'package.json', type: 'file' as const },
      { name: 'tsconfig.json', type: 'file' as const },
      { name: 'next.config.ts', type: 'file' as const },
      { name: '.gitignore', type: 'file' as const },
      { name: 'README.md', type: 'file' as const }
    ]
  };

  await downloadZip(folderStructure, 'nextjs-blueprint.zip');
};

// Made with Bob
