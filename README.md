<div align="center">

# 🏗️ BobArchitecLegacyLens

### From Spaghetti Code to Clean Architecture in Seconds.

An enterprise-grade modernization assistant powered by **IBM watsonx.ai** that analyzes legacy codebases and generates complete architectural blueprints — including database schemas, folder structures, API contracts, and modernized code.

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Powered by IBM watsonx.ai](https://img.shields.io/badge/IBM_watsonx.ai-Granite_4H-0062FF?logo=ibm)](https://www.ibm.com/watsonx)
[![Hackathon](https://img.shields.io/badge/lablab.ai-IBM_Bob_Hackathon-green)](https://lablab.ai/ai-hackathons/ibm-bob-hackathon)

[Live Demo](#) • [Documentation](#-how-it-works) • [Report Bug](https://github.com/benjaminayala0/BobArchitecLegacyLens/issues)

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
| **Framework** | Next.js 16 (App Router) | Fast development with built-in API routes and SSR |
| **Styling** | Tailwind CSS v4 | Utility-first CSS for premium dark UI |
| **Components** | Shadcn UI (Radix + Maia) | Accessible, customizable component library |
| **Diagrams** | Mermaid.js v11 | Dynamic ER diagram rendering |
| **Icons** | Lucide React | Clean, consistent iconography |
| **Animations** | Framer Motion | Smooth transitions and micro-interactions |
| **File Processing** | JSZip | ZIP file creation and extraction |
| **Authentication** | IBM Cloud IAM | Secure API key authentication |

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
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts          # IBM watsonx.ai API integration
│   │   ├── layout.tsx                # Root layout with theme provider
│   │   ├── page.tsx                  # Main dashboard (analysis + blueprint)
│   │   └── globals.css               # Global styles and design tokens
│   │
│   ├── components/
│   │   ├── ui/                       # Shadcn UI base components (40+ components)
│   │   ├── analysis-panel.tsx        # Real-time analysis progress display
│   │   ├── api-contract.tsx          # REST API documentation viewer
│   │   ├── code-viewer.tsx           # Before/After code comparison
│   │   ├── database-schema.tsx       # SQL schema display with syntax highlighting
│   │   ├── er-diagram.tsx            # Interactive Mermaid.js ER diagram
│   │   ├── folder-scaffolding.tsx    # Clean Architecture folder tree
│   │   ├── header.tsx                # App header with branding
│   │   ├── theme-provider.tsx        # Dark/Light theme context
│   │   ├── theme-toggle.tsx          # Theme switcher button
│   │   └── upload-zone.tsx           # Drag-drop file upload + code paste
│   │
│   ├── lib/
│   │   ├── apiContractGenerator.ts   # Generates REST API markdown docs
│   │   ├── index.ts                  # Barrel export for all utilities
│   │   ├── mermaidGenerator.ts       # Converts blueprint → Mermaid ER syntax
│   │   ├── sqlGenerator.ts           # Generates PostgreSQL CREATE TABLE statements
│   │   ├── utils.ts                  # Shared utility functions (cn, etc.)
│   │   └── zipDownloader.ts          # Creates downloadable ZIP with real code
│   │
│   ├── types/
│   │   └── blueprint.ts              # TypeScript interfaces and validators
│   │
│   └── hooks/
│       ├── use-mobile.ts             # Responsive breakpoint detection
│       └── use-toast.tsx             # Toast notification system
│
├── public/
│   └── images/                       # App screenshots and assets
│
├── test-samples/                     # Example legacy code files
│   ├── HotelServlet.java
│   ├── legacy_patient_zero.php
│   └── legacy_school_system.py
│
├── .env.example                      # Environment variables template
├── components.json                   # Shadcn UI configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies and scripts
├── tailwind.config.ts                # Tailwind CSS configuration
└── tsconfig.json                     # TypeScript configuration
```

## 🎨 Design System

### Color Palette
- **Background:** Deep Charcoal (`#0A0A0A`)
- **Primary Accent:** Electric Blue (`#0062FF` — IBM Brand)
- **Secondary:** Slate Gray (`#1E1E1E`)
- **Text:** Soft Gray (`#A8A8A8`) on dark surfaces
- **Success:** Emerald Green (`#10B981`)
- **Warning:** Amber (`#F59E0B`)
- **Error:** Red (`#EF4444`)

### Visual Effects
- **Glassmorphism cards** with backdrop blur
- **Subtle gradient borders** on interactive elements
- **Smooth animations** powered by Framer Motion
- **Responsive grid layouts** adapting to all screen sizes

### Typography
- **Font Family:** Figtree (via Shadcn Maia preset)
- **Monospace:** JetBrains Mono for code blocks

## 🔧 Key Features Implemented

### ✅ Core Functionality
- [x] **IBM watsonx.ai Integration** — Granite 4H Small model for code analysis
- [x] **IAM Authentication** — Secure token-based API authentication
- [x] **Multi-file Upload** — Support for ZIP archives and individual files
- [x] **Code Paste Interface** — Direct code input via textarea
- [x] **Real-time Analysis** — Progress indicators during AI processing
- [x] **Parallel API Calls** — 3 concurrent watsonx.ai requests for faster results

### ✅ Output Generators
- [x] **ER Diagram Generator** — Mermaid.js syntax with entity relationships
- [x] **SQL Schema Generator** — PostgreSQL-compliant CREATE TABLE statements
- [x] **API Contract Generator** — REST endpoint documentation in markdown
- [x] **Folder Structure Generator** — Clean Architecture scaffolding
- [x] **Code Modernizer** — TypeScript/NestJS conversion (max 15 lines)

### ✅ Export & Download
- [x] **ZIP Downloader** — Complete project scaffold with real code
- [x] **Entity Files** — TypeORM entity classes with decorators
- [x] **Service Files** — NestJS service classes with CRUD operations
- [x] **Smart Content Generation** — Context-aware file content based on analysis

### ✅ UI/UX Enhancements
- [x] **Dark/Light Theme Toggle** — Persistent theme preference
- [x] **Responsive Design** — Mobile, tablet, and desktop layouts
- [x] **Split-view Code Comparison** — Before/After side-by-side
- [x] **Interactive Components** — Collapsible sections, tabs, accordions
- [x] **Error Handling** — User-friendly error messages with recovery options

### ✅ Developer Experience
- [x] **TypeScript Strict Mode** — Full type safety
- [x] **Centralized Type Definitions** — Single source of truth in `blueprint.ts`
- [x] **Barrel Exports** — Clean imports via `@/lib` index
- [x] **Comprehensive Documentation** — JSDoc comments on all utilities
- [x] **Example Files** — Test samples for quick testing

## 🧪 Testing the Application

### Sample Legacy Code Files

The project includes three test samples in `test-samples/`:

1. **HotelServlet.java** — Legacy Java servlet with SQL injection vulnerabilities
2. **legacy_patient_zero.php** — PHP medical system with mixed concerns
3. **legacy_school_system.py** — Python school management with procedural code

### Quick Test

```bash
# Upload one of the sample files through the UI
# Or paste this sample code:

<?php
// Legacy PHP code
$conn = mysqli_connect("localhost", "root", "", "hospital");
$patient_id = $_GET['id'];
$query = "SELECT * FROM patients WHERE id = " . $patient_id;
$result = mysqli_query($conn, $query);
?>
```

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

## 🔐 Security Considerations

- **API Key Protection** — Environment variables never committed to Git
- **SQL Injection Prevention** — Identifier validation and sanitization
- **Input Validation** — Blueprint validation with TypeScript type guards
- **SSR Safety** — Browser-only functions protected with `typeof window` checks
- **CORS Configuration** — Restricted to same-origin requests

## 🚧 Known Limitations

- **Code Length** — Modernized code limited to 15 lines for performance
- **Entity Count** — Maximum 6 entities per analysis
- **Relationship Count** — Maximum 5 relationships per analysis
- **File Types** — Supports common languages (Java, PHP, Python, JavaScript, TypeScript, SQL, COBOL)
- **ZIP Size** — Large archives may timeout (recommended < 10MB)

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] IBM watsonx.ai integration
- [x] Basic analysis pipeline
- [x] ER diagram generation
- [x] SQL schema export
- [x] ZIP download functionality

### Phase 2 (Planned)
- [ ] Multi-language support (Spanish, Portuguese)
- [ ] Advanced code metrics (cyclomatic complexity, code smells)
- [ ] Git repository integration (analyze entire repos)
- [ ] Incremental analysis (analyze changes only)
- [ ] Custom architecture templates (Hexagonal, Onion, etc.)

### Phase 3 (Future)
- [ ] AI-powered refactoring suggestions
- [ ] Automated test generation
- [ ] Migration cost estimation
- [ ] Team collaboration features
- [ ] CI/CD pipeline integration

## 🏆 IBM Bob Hackathon

This project was built during the [IBM Bob Hackathon](https://lablab.ai/ai-hackathons/ibm-bob-hackathon) on lablab.ai (May 15–17, 2026).

### Team
- **Benjamín Ayala** — Architecture Lead & Project Strategy
- **Oscar Lindo** — Frontend Lead & AI Integration

### Achievements
- ✨ Full IBM watsonx.ai integration with Granite 4H Small
- 🎨 Premium dark UI with 40+ Shadcn components
- 📦 Complete modernization pipeline from analysis to export
- 🚀 Production-ready Next.js 16 application

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using IBM watsonx.ai**

[⬆ Back to Top](#-bobarchiteclegacylens)

</div>
