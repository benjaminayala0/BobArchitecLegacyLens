/**
 * Examples demonstrating the adaptJsonToFolderNodes adapter function
 * This shows how to convert nested object maps to FolderNode format
 */

import { adaptJsonToFolderNodes, downloadZip } from './zipDownloader';

// Example 1: Simple nested structure
export const example1_SimpleAdapter = async () => {
  const nestedJson = {
    "src": {
      "index.ts": "console.log('Hello World');",
      "app.ts": "export const app = () => { };"
    },
    "README.md": "# My Simple Project\n\nThis is a simple project."
  };

  const folderNodes = adaptJsonToFolderNodes(nestedJson);
  await downloadZip(folderNodes, 'simple-project.zip');
};

// Example 2: Complex nested structure with multiple levels
export const example2_ComplexAdapter = async () => {
  const nestedJson = {
    "src": {
      "domain": {
        "User.ts": "export class User {\n  constructor(public name: string) {}\n}",
        "Product.ts": "export class Product {\n  constructor(public id: number) {}\n}",
        "Order.ts": "export class Order {\n  items: Product[] = [];\n}"
      },
      "infrastructure": {
        "database": {
          "connection.ts": "export const db = createConnection();",
          "migrations": {
            "001_initial.sql": "CREATE TABLE users (id INT PRIMARY KEY);"
          }
        },
        "api": {
          "client.ts": "export const apiClient = axios.create();"
        }
      },
      "application": {
        "services": {
          "UserService.ts": "export class UserService {\n  async getUser(id: string) {}\n}",
          "ProductService.ts": "export class ProductService {\n  async getProduct(id: number) {}\n}"
        },
        "useCases": {
          "CreateUser.ts": "export const createUser = async (data: any) => {};",
          "UpdateUser.ts": "export const updateUser = async (id: string, data: any) => {};"
        }
      },
      "presentation": {
        "controllers": {
          "UserController.ts": "export class UserController {\n  async create(req, res) {}\n}",
          "ProductController.ts": "export class ProductController {\n  async list(req, res) {}\n}"
        },
        "routes": {
          "userRoutes.ts": "export const userRoutes = Router();",
          "productRoutes.ts": "export const productRoutes = Router();"
        }
      }
    },
    "tests": {
      "unit": {
        "User.test.ts": "describe('User', () => {\n  it('should create user', () => {});\n});"
      },
      "integration": {
        "api.test.ts": "describe('API', () => {\n  it('should respond', () => {});\n});"
      }
    },
    "config": {
      "database.json": JSON.stringify({
        host: "localhost",
        port: 5432,
        database: "myapp"
      }, null, 2),
      "app.json": JSON.stringify({
        name: "My App",
        version: "1.0.0"
      }, null, 2)
    },
    "package.json": JSON.stringify({
      name: "complex-app",
      version: "1.0.0",
      dependencies: {
        express: "^4.18.0",
        typescript: "^5.0.0"
      }
    }, null, 2),
    "tsconfig.json": JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        strict: true
      }
    }, null, 2),
    ".gitignore": "node_modules/\n.env\n*.log\ndist/\nbuild/",
    "README.md": "# Complex Application\n\n## Architecture\n\nThis follows Clean Architecture principles.\n\n## Setup\n\n```bash\nnpm install\nnpm run dev\n```"
  };

  const folderNodes = adaptJsonToFolderNodes(nestedJson);
  await downloadZip(folderNodes, 'complex-app-blueprint.zip');
};

// Example 3: Full-stack application structure
export const example3_FullStackAdapter = async () => {
  const nestedJson = {
    "frontend": {
      "src": {
        "components": {
          "Header.tsx": "export const Header = () => <header>My App</header>;",
          "Footer.tsx": "export const Footer = () => <footer>© 2024</footer>;",
          "Button.tsx": "export const Button = ({ children }) => <button>{children}</button>;"
        },
        "pages": {
          "Home.tsx": "export const Home = () => <div>Home Page</div>;",
          "About.tsx": "export const About = () => <div>About Page</div>;"
        },
        "hooks": {
          "useAuth.ts": "export const useAuth = () => { return { user: null }; };",
          "useFetch.ts": "export const useFetch = (url: string) => { };"
        },
        "utils": {
          "api.ts": "export const api = { get: async (url: string) => {} };",
          "format.ts": "export const formatDate = (date: Date) => date.toISOString();"
        },
        "App.tsx": "import { Header } from './components/Header';\n\nexport const App = () => <div><Header /></div>;",
        "index.tsx": "import { App } from './App';\n\nReactDOM.render(<App />, document.getElementById('root'));"
      },
      "public": {
        "index.html": "<!DOCTYPE html>\n<html>\n<head><title>My App</title></head>\n<body><div id=\"root\"></div></body>\n</html>"
      },
      "package.json": JSON.stringify({
        name: "frontend",
        dependencies: {
          react: "^18.0.0",
          "react-dom": "^18.0.0"
        }
      }, null, 2)
    },
    "backend": {
      "src": {
        "controllers": {
          "authController.ts": "export const login = async (req, res) => { };",
          "userController.ts": "export const getUsers = async (req, res) => { };"
        },
        "models": {
          "User.ts": "export class User {\n  id: string;\n  email: string;\n}",
          "Post.ts": "export class Post {\n  id: string;\n  title: string;\n}"
        },
        "routes": {
          "authRoutes.ts": "import { Router } from 'express';\nexport const authRoutes = Router();",
          "userRoutes.ts": "import { Router } from 'express';\nexport const userRoutes = Router();"
        },
        "middleware": {
          "auth.ts": "export const authMiddleware = (req, res, next) => { next(); };",
          "errorHandler.ts": "export const errorHandler = (err, req, res, next) => { };"
        },
        "services": {
          "emailService.ts": "export const sendEmail = async (to: string, subject: string) => { };",
          "storageService.ts": "export const uploadFile = async (file: any) => { };"
        },
        "config": {
          "database.ts": "export const dbConfig = { host: 'localhost', port: 5432 };",
          "jwt.ts": "export const jwtConfig = { secret: process.env.JWT_SECRET };"
        },
        "server.ts": "import express from 'express';\n\nconst app = express();\napp.listen(3000);"
      },
      "package.json": JSON.stringify({
        name: "backend",
        dependencies: {
          express: "^4.18.0",
          jsonwebtoken: "^9.0.0"
        }
      }, null, 2)
    },
    "shared": {
      "types": {
        "User.ts": "export interface User {\n  id: string;\n  email: string;\n}",
        "Post.ts": "export interface Post {\n  id: string;\n  title: string;\n}"
      },
      "constants": {
        "errors.ts": "export const ERROR_CODES = {\n  UNAUTHORIZED: 'UNAUTHORIZED',\n  NOT_FOUND: 'NOT_FOUND'\n};",
        "routes.ts": "export const API_ROUTES = {\n  AUTH: '/api/auth',\n  USERS: '/api/users'\n};"
      }
    },
    "docker-compose.yml": "version: '3.8'\nservices:\n  frontend:\n    build: ./frontend\n  backend:\n    build: ./backend",
    ".gitignore": "node_modules/\n.env\n*.log\ndist/\nbuild/\n.DS_Store",
    "README.md": "# Full-Stack Application\n\n## Structure\n\n- `frontend/` - React frontend\n- `backend/` - Express backend\n- `shared/` - Shared types and constants\n\n## Getting Started\n\n```bash\ndocker-compose up\n```"
  };

  const folderNodes = adaptJsonToFolderNodes(nestedJson);
  await downloadZip(folderNodes, 'fullstack-blueprint.zip');
};

// Example 4: Microservices architecture
export const example4_MicroservicesAdapter = async () => {
  const nestedJson = {
    "services": {
      "auth-service": {
        "src": {
          "index.ts": "console.log('Auth Service');",
          "handlers": {
            "login.ts": "export const login = async () => { };",
            "register.ts": "export const register = async () => { };"
          }
        },
        "package.json": JSON.stringify({ name: "auth-service" }, null, 2),
        "Dockerfile": "FROM node:18\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"npm\", \"start\"]"
      },
      "user-service": {
        "src": {
          "index.ts": "console.log('User Service');",
          "handlers": {
            "getUser.ts": "export const getUser = async () => { };",
            "updateUser.ts": "export const updateUser = async () => { };"
          }
        },
        "package.json": JSON.stringify({ name: "user-service" }, null, 2),
        "Dockerfile": "FROM node:18\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"npm\", \"start\"]"
      },
      "notification-service": {
        "src": {
          "index.ts": "console.log('Notification Service');",
          "handlers": {
            "sendEmail.ts": "export const sendEmail = async () => { };",
            "sendSMS.ts": "export const sendSMS = async () => { };"
          }
        },
        "package.json": JSON.stringify({ name: "notification-service" }, null, 2),
        "Dockerfile": "FROM node:18\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"npm\", \"start\"]"
      }
    },
    "gateway": {
      "src": {
        "index.ts": "console.log('API Gateway');",
        "routes.ts": "export const routes = [];"
      },
      "package.json": JSON.stringify({ name: "api-gateway" }, null, 2)
    },
    "docker-compose.yml": "version: '3.8'\nservices:\n  auth:\n    build: ./services/auth-service\n  user:\n    build: ./services/user-service\n  notification:\n    build: ./services/notification-service\n  gateway:\n    build: ./gateway",
    "README.md": "# Microservices Architecture\n\n## Services\n\n- Auth Service\n- User Service\n- Notification Service\n- API Gateway"
  };

  const folderNodes = adaptJsonToFolderNodes(nestedJson);
  await downloadZip(folderNodes, 'microservices-blueprint.zip');
};

// Example 5: Empty folders handling
export const example5_EmptyFoldersAdapter = async () => {
  const nestedJson = {
    "src": {
      "components": {},  // Empty folder
      "utils": {},       // Empty folder
      "index.ts": "console.log('Main');"
    },
    "tests": {},         // Empty folder
    "docs": {},          // Empty folder
    "README.md": "# Project with empty folders"
  };

  const folderNodes = adaptJsonToFolderNodes(nestedJson);
  await downloadZip(folderNodes, 'empty-folders.zip');
};

// Example 6: Direct usage - one-liner
export const example6_DirectUsage = async () => {
  // You can chain the adapter and download in one go
  await downloadZip(
    adaptJsonToFolderNodes({
      "src": {
        "index.ts": "console.log('Hello');",
        "utils": {
          "helper.ts": "export const help = () => {};"
        }
      },
      "README.md": "# Quick Project"
    }),
    'quick-project.zip'
  );
};

// Made with Bob
