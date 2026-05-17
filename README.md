<div align="center">

# 🏗️ BobArchitecLegacyLens

### From Spaghetti Code to Clean Architecture in Seconds.

An enterprise-grade modernization assistant powered by **IBM watsonx.ai** that analyzes legacy codebases and generates complete architectural blueprints — including database schemas, folder structures, API contracts, and modernized code.

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Powered by IBM watsonx.ai](https://img.shields.io/badge/IBM_watsonx.ai-Granite_4H_Small-0062FF?logo=ibm)](https://www.ibm.com/watsonx)
[![Hackathon](https://img.shields.io/badge/lablab.ai-IBM_Bob_Hackathon-green)](https://lablab.ai/ai-hackathons/ibm-bob-hackathon)

[Live Demo](https://bob-architec-legacy-lens.vercel.app/) • [Documentation](#-how-it-works) • [Report Bug](https://github.com/benjaminayala0/BobArchitecLegacyLens/issues)

</div>

---

## 🔥 The Problem

Legacy code costs enterprises **billions of dollars** annually. Entire development teams spend months reverse-engineering spaghetti codebases just to understand what the system does before they can even begin modernizing it.

Traditional approaches involve:
- 💸 Expensive consulting firms charging $200-500/hour
- 📊 Manual code audits taking weeks or months
- 🤝 Architecture meetings that drag on endlessly
- 📝 Documentation that's outdated before it's finished

**All before a single line of modern code is written.**

## 💡 The Solution

**BobArchitecLegacyLens** leverages IBM watsonx.ai's Granite 4H Small model to automate the most painful phase of modernization: **the architectural analysis**.

Simply upload your legacy code → IBM watsonx.ai analyzes it with full context → Get a complete modernization blueprint in seconds.

### What You Get:

| Output | Description |
|--------|-------------|
| 📊 **ER Diagram** | Interactive visual diagram of the detected database schema (Mermaid.js) |
| 🗃️ **SQL Schema** | Normalized PostgreSQL schema generated from implicit table structures |
| 📁 **Folder Scaffolding** | Clean Architecture directory tree (Domain, Application, Infrastructure, Presentation) |
| 📄 **Legacy Code Inspector** | Clean, syntax-highlighted viewer for the uploaded legacy source |
| 📦 **Export ZIP** | One-click download of the complete modernized project scaffold with real code |
| 📋 **API Contract** | Auto-generated REST endpoint definitions based on detected business logic |

## 🎯 How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Legacy Code     │ ──▶ │  IBM watsonx.ai   │ ──▶ │  Modernization      │
│  (PHP, Java,     │     │  Granite 4H Small │     │  Blueprint          │
│   Python, COBOL) │     │  (Full-context)   │     │  (JSON structured)  │
└─────────────────┘     └──────────────────┘     └────────┬────────────┘
                                                           │
                                              ┌────────────┼────────────┐
                                              ▼            ▼            ▼
                                         ER Diagram   SQL Schema   Folder Tree
```

### Step-by-Step Process:

1. **Upload** your legacy file, ZIP archive, or paste code directly into the dashboard
2. **Analyze** — IBM watsonx.ai reads the full context, extracts business entities, relationships, and implicit schemas
3. **Visualize** — The dashboard renders:
   - Interactive ER diagram with entity relationships
   - Normalized SQL schema (PostgreSQL)
   - Clean Architecture folder tree
   - Modernized TypeScript/NestJS code
   - RESTful API contract documentation
4. **Export** — Download the complete modernized scaffold as a `.zip` file with real, working code

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **AI Engine** | IBM watsonx.ai (Granite 4H Small) | Full-context legacy code analysis with enterprise-grade LLM |
| **Framework** | Next.js 16.2.6 (App Router) | React 19 with built-in API routes and SSR |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with custom design tokens |
| **Components** | Shadcn UI + Base UI + Radix UI | Accessible, production-ready component library |
| **Diagrams** | Mermaid.js v11.15 | Dynamic ER diagram rendering |
| **Icons** | Lucide React + HugeIcons | Comprehensive icon system |
| **Animations** | Framer Motion v12 | Smooth transitions and micro-interactions |
| **File Processing** | JSZip v3.10 | ZIP file creation and extraction |
| **Authentication** | IBM Cloud IAM | Secure token-based API authentication |
| **Analytics** | Vercel Analytics | Production monitoring and insights |

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **IBM Cloud Account** with watsonx.ai access
- **IBM watsonx.ai API Key** and Project ID

### Installation

```bash
# Clone the repository
git clone https://github.com/benjaminayala0/BobArchitecLegacyLens.git

# Navigate to the project
cd bob-arch-legacylens

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Configuration

Edit `.env.local` with your IBM watsonx.ai credentials:

```env
# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_watsonx_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com/
```

**How to get your credentials:**
1. Sign up for [IBM Cloud](https://cloud.ibm.com/)
2. Create a watsonx.ai project
3. Generate an API key from IAM
4. Copy your Project ID from the watsonx.ai dashboard

### Run the Application

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
bob-arch-legacylens/
├── src/
│   ├── app/                          # Next.js 16 App Router
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts          # IBM watsonx.ai integration (Granite 4H Small)
│   │   ├── docs/
│   │   │   └── page.tsx              # Documentation page
│   │   ├── layout.tsx                # Root layout with theme provider
│   │   ├── page.tsx                  # Main dashboard (analysis + blueprint)
│   │   ├── globals.css               # Global styles and Tailwind v4 config
│   │   └── icon.png                  # App favicon
│   │
│   ├── components/
│   │   ├── ui/                       # 60+ Shadcn/Base UI components
│   │   ├── analysis-panel.tsx        # Real-time analysis progress display
│   │   ├── api-contract.tsx          # REST API documentation viewer
│   │   ├── code-viewer.tsx           # Before/After code comparison
│   │   ├── database-schema.tsx       # SQL schema display with syntax highlighting
│   │   ├── er-diagram.tsx            # Interactive Mermaid.js ER diagram
│   │   ├── folder-scaffolding.tsx    # Clean Architecture folder tree
│   │   ├── header.tsx                # App header with branding
│   │   ├── theme-provider.tsx        # Dark/Light theme context (next-themes)
│   │   ├── theme-toggle.tsx          # Theme switcher button
│   │   └── upload-zone.tsx           # Drag-drop file upload + code paste + ZIP support
│   │
│   ├── lib/
│   │   ├── apiContractGenerator.ts   # Generates REST API markdown docs
│   │   ├── index.ts                  # Barrel export for all utilities
│   │   ├── mermaidGenerator.ts       # Converts blueprint → Mermaid ER syntax
│   │   ├── sqlGenerator.ts           # Generates PostgreSQL CREATE TABLE statements
│   │   ├── utils.ts                  # Shared utility functions (cn, clsx)
│   │   └── zipDownloader.ts          # Creates downloadable ZIP with real code
│   │
│   ├── types/
│   │   └── blueprint.ts              # TypeScript interfaces, validators, and type guards
│   │
│   ├── hooks/
│   │   ├── use-mobile.ts             # Responsive breakpoint detection
│   │   └── use-toast.tsx             # Toast notification system (Sonner)
│   │
│   └── docs/
│       ├── component-specs.json      # Component specifications
│       └── designs-tokens.json       # Design system tokens
│
├── public/
│   └── images/
│       └── bob3.png                  # App logo/branding
│
├── test-samples/                     # Example legacy code files for testing
│   ├── HotelServlet.java             # Java servlet with SQL injection
│   ├── legacy_patient_zero.php       # PHP medical system
│   ├── legacy_payroll.cbl            # COBOL payroll system
│   └── legacy_school_system.py       # Python school management
│
├── components.json                   # Shadcn UI configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies and scripts
├── postcss.config.mjs                # PostCSS configuration
├── tsconfig.json                     # TypeScript strict mode configuration
└── eslint.config.mjs                 # ESLint v9 configuration
```

## 🎨 Design System

### Color Palette
- **Background:** Deep Charcoal (`#0A0A0A`)
- **Primary Accent:** IBM Blue (`#0062FF`)
- **Secondary:** Slate Gray (`#1E1E1E`)
- **Text:** Soft Gray (`#A8A8A8`) on dark surfaces
- **Success:** Emerald Green (`#10B981`)
- **Warning:** Amber (`#F59E0B`)
- **Error:** Red (`#EF4444`)

### Visual Effects
- **Glassmorphism cards** with backdrop blur
- **Subtle gradient borders** on interactive elements
- **Smooth animations** powered by Framer Motion v12
- **Responsive grid layouts** with Tailwind CSS v4
- **Dark/Light theme support** with next-themes

### Typography
- **System Fonts:** Optimized for performance and readability
- **Monospace:** For code blocks and technical content

## 🔧 Key Features

### ✅ Core Functionality
- **IBM watsonx.ai Integration** — Granite 4H Small model with IAM authentication
- **Multi-format Input** — ZIP archives, individual files, or direct code paste
- **Parallel AI Processing** — 3 concurrent watsonx.ai API calls for optimal performance
- **Real-time Progress** — Live analysis status with visual feedback
- **Robust Error Handling** — Graceful fallbacks and user-friendly error messages

### ✅ AI-Powered Analysis
- **Entity Extraction** — Automatic detection of database entities and fields
- **Relationship Mapping** — Identifies one-to-many, many-to-one, and many-to-many relationships
- **Schema Generation** — PostgreSQL-compliant CREATE TABLE statements
- **ER Diagram** — Interactive Mermaid.js visualizations
- **API Contract Generation** — REST endpoint documentation based on business logic
- **Code Modernization** — TypeScript/NestJS conversion with best practices

### ✅ Export & Scaffolding
- **Complete ZIP Export** — Downloadable project scaffold with real, working code
- **TypeORM Entities** — Fully decorated entity classes
- **NestJS Services** — CRUD operations with dependency injection
- **Clean Architecture** — Domain, Application, Infrastructure, Presentation layers
- **Smart Content Generation** — Context-aware file content based on analysis

### ✅ UI/UX
- **Dark/Light Theme** — Persistent theme preference with next-themes
- **Responsive Design** — Optimized for mobile, tablet, and desktop
- **Split-view Comparison** — Before/After code side-by-side
- **Interactive Components** — 60+ Shadcn/Base UI components
- **Drag & Drop Upload** — Intuitive file upload experience

### ✅ Production Ready
- **TypeScript Strict Mode** — Full type safety and validation
- **Vercel Analytics** — Production monitoring and insights
- **SSR Safety** — Browser-only functions properly guarded
- **SQL Injection Prevention** — Identifier validation and sanitization
- **Comprehensive Testing** — Multiple legacy code samples included

## 🧪 Testing the Application

### Sample Legacy Code Files

The project includes four test samples in `test-samples/`:

1. **HotelServlet.java** — Legacy Java servlet with SQL injection vulnerabilities
2. **legacy_patient_zero.php** — PHP medical system with mixed concerns
3. **legacy_school_system.py** — Python school management with procedural code
4. **legacy_payroll.cbl** — COBOL payroll system (mainframe legacy)

### Quick Test

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Upload one of the sample files or paste code directly
4. Watch IBM watsonx.ai analyze and generate the blueprint
5. Export the modernized scaffold as a ZIP file

### Supported Languages
- Java, PHP, Python, JavaScript, TypeScript
- COBOL, C, C++, C#, Ruby, Go
- SQL and other common legacy languages

## 📊 API Reference

### POST `/api/analyze`

Analyzes legacy code and returns a modernization blueprint.

**Request Body:**
```json
{
  "code": "string (legacy code content)",
  "zipBase64": "string (optional, base64-encoded ZIP)"
}
```

**Response:**
```json
{
  "entities": [
    {
      "name": "Patient",
      "table": "patients",
      "fields": [
        {
          "name": "id",
          "type": "integer",
          "primary_key": true
        }
      ]
    }
  ],
  "relationships": [
    {
      "from": "Patient",
      "to": "Appointment",
      "type": "one-to-many",
      "description": "patient has appointments"
    }
  ],
  "suggested_folder_structure": {
    "src": {
      "controllers": ["PatientController.ts"],
      "services": ["PatientService.ts"],
      "models": ["Patient.ts"]
    }
  },
  "databaseSchema": "CREATE TABLE patients (...);",
  "erDiagram": "erDiagram\n  Patient {...}",
  "modernizedCode": "// TypeScript modernized version",
  "apiContracts": [
    {
      "method": "GET",
      "endpoint": "/api/patients",
      "description": "Get all patients"
    }
  ]
}
```

## 🔐 Security & Best Practices

- **API Key Protection** — Environment variables with `.env.local` (never committed)
- **SQL Injection Prevention** — Strict identifier validation and sanitization
- **Input Validation** — TypeScript type guards and runtime validation
- **SSR Safety** — Browser-only functions protected with `typeof window` checks
- **IAM Authentication** — Secure token-based authentication with IBM Cloud
- **Error Handling** — Comprehensive try-catch blocks with graceful fallbacks
- **Type Safety** — TypeScript strict mode enabled across the entire codebase

## 🚧 Known Limitations

- **Modernized Code** — Limited to 15 lines for optimal performance and readability
- **Entity Count** — Maximum 6 entities per analysis (configurable in prompts)
- **Relationship Count** — Maximum 5 relationships per analysis
- **ZIP Size** — Recommended < 10MB to avoid timeouts
- **AI Model Constraints** — Response quality depends on IBM watsonx.ai availability and token limits

## 🗺️ Roadmap

### ✅ Phase 1 (Completed)
- IBM watsonx.ai integration with Granite 4H Small
- Complete analysis pipeline with parallel processing
- ER diagram generation with Mermaid.js
- SQL schema export (PostgreSQL)
- ZIP download with real code scaffolding
- Production deployment on Vercel

### 🚀 Phase 2 (Planned)
- Multi-language UI support (Spanish, Portuguese)
- Advanced code metrics (cyclomatic complexity, maintainability index)
- Git repository integration (analyze entire repos via URL)
- Incremental analysis (analyze only changed files)
- Custom architecture templates (Hexagonal, Onion, CQRS)
- Batch processing for multiple files

### 🔮 Phase 3 (Future Vision)
- AI-powered refactoring suggestions with step-by-step guides
- Automated test generation (unit, integration, e2e)
- Migration cost estimation and timeline prediction
- Team collaboration features (shared blueprints, comments)
- CI/CD pipeline integration (GitHub Actions, GitLab CI)
- Real-time collaboration with WebSockets

## 🏆 IBM Bob Hackathon

This project was built during the [IBM Bob Hackathon](https://lablab.ai/ai-hackathons/ibm-bob-hackathon) on lablab.ai (May 15–17, 2026).

### 👥 Team
- **Benjamín Ayala** — Full-Stack Architecture & AI Integration
- **Oscar Lindo** — Frontend Development & UI/UX Design

### 🎯 Achievements
- ✨ Full IBM watsonx.ai integration with Granite 4H Small model
- 🎨 Production-grade UI with 60+ accessible components
- 📦 Complete modernization pipeline from legacy code to modern scaffold
- 🚀 Deployed to production on Vercel with analytics
- 🔒 Enterprise-grade security with IAM authentication
- 📊 Real-time analysis with parallel AI processing
- 💾 Smart ZIP export with context-aware code generation

## 🤝 Contributing

Contributions are welcome! We appreciate your interest in improving BobArchitecLegacyLens.

### How to Contribute

1. **Fork the repository** on GitHub
2. **Clone your fork** locally: `git clone https://github.com/YOUR_USERNAME/BobArchitecLegacyLens.git`
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Make your changes** with clear, descriptive commits
5. **Test thoroughly** to ensure nothing breaks
6. **Push to your fork**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** with a detailed description of your changes

### Development Guidelines

- Follow TypeScript strict mode conventions
- Maintain existing code style and formatting
- Add JSDoc comments for new functions
- Update tests if applicable
- Keep commits atomic and well-described

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

### 🌟 Built with IBM watsonx.ai Granite 4H Small

**[Live Demo](https://bob-architec-legacy-lens.vercel.app/)** • **[Report Issues](https://github.com/benjaminayala0/BobArchitecLegacyLens/issues)** • **[Star on GitHub](https://github.com/benjaminayala0/BobArchitecLegacyLens)**

Made with ❤️ during the IBM Bob Hackathon 2026

[⬆ Back to Top](#-bobarchiteclegacylens)

</div>
