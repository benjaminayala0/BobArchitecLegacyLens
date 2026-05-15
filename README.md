<div align="center">

# 🏗️ BobArchitecLegacyLens

### From Spaghetti Code to Clean Architecture in Seconds.

An enterprise-grade modernization assistant powered by **IBM Bob** that analyzes legacy codebases and generates complete architectural blueprints — including database schemas, folder structures, and API contracts.

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Powered by IBM Bob](https://img.shields.io/badge/IBM_Bob-Powered-0062FF?logo=ibm)](https://ibm.com)
[![Hackathon](https://img.shields.io/badge/lablab.ai-IBM_Bob_Hackathon-green)](https://lablab.ai/ai-hackathons/ibm-bob-hackathon)

</div>

---

## 🔥 The Problem

Legacy code costs enterprises **billions of dollars** annually. Entire development teams spend months reverse-engineering spaghetti codebases just to understand what the system does before they can even begin modernizing it.

Traditional approaches involve expensive consulting firms, manual code audits, and architecture meetings that drag on for weeks — all before a single line of modern code is written.

## 💡 The Solution

**BobArchitecLegacyLens** leverages IBM Bob's full-repository contextual understanding to automate the most painful phase of modernization: **the architectural analysis**.

Drop your legacy code → IBM Bob reads and reasons about it → Get a complete modernization blueprint in seconds.

### What You Get:

| Output | Description |
|---|---|
| 📊 **ER Diagram** | Interactive visual diagram of the detected database schema (Mermaid.js) |
| 🗃️ **SQL Schema** | Normalized PostgreSQL schema generated from implicit table structures |
| 📁 **Folder Scaffolding** | Clean Architecture directory tree (Domain, Application, Infrastructure, Presentation) |
| 🔀 **Before & After** | Split-view code comparison highlighting legacy vs. modern patterns |
| 📦 **Export ZIP** | One-click download of the complete modernized project scaffold |
| 📋 **API Contract** | Auto-generated REST endpoint definitions based on detected business logic |

## 🎯 How It Works

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────────┐
│  Legacy Code     │ ──▶ │   IBM Bob     │ ──▶ │  Modernization      │
│  (PHP, Java,     │     │  (Full-context│     │  Blueprint          │
│   Python, etc.)  │     │   analysis)   │     │  (JSON structured)  │
└─────────────────┘     └──────────────┘     └────────┬────────────┘
                                                       │
                                          ┌────────────┼────────────┐
                                          ▼            ▼            ▼
                                     ER Diagram   SQL Schema   Folder Tree
```

1. **Upload** your legacy file or paste code directly into the dashboard.
2. **Analyze** — IBM Bob reads the full context, extracts business entities, relationships, and implicit schemas.
3. **Visualize** — The dashboard renders an interactive ER diagram, a normalized SQL schema, and a Clean Architecture folder tree.
4. **Export** — Download the complete modernized scaffold as a `.zip` file, ready to `npm install`.

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Fast development with built-in API routes |
| **Styling** | Tailwind CSS | Utility-first CSS for premium dark UI |
| **Components** | Shadcn UI (Radix + Maia) | Accessible, customizable component library |
| **Diagrams** | Mermaid.js | Dynamic ER diagram rendering |
| **Icons** | Lucide React | Clean, consistent iconography |
| **Animations** | Framer Motion | Smooth transitions and micro-interactions |
| **Core AI** | IBM Bob | Full-context legacy code analysis engine |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- IBM Bob access (provided during the hackathon)

### Installation

```bash
# Clone the repository
git clone https://github.com/benjaminayala0/BobArchitecLegacyLens.git

# Navigate to the project
cd bob-arch-legacylens

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx          # Root layout with dark theme
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles and design tokens
├── components/
│   ├── ui/                 # Shadcn UI base components
│   ├── viz/                # Mermaid diagram and visualization components
│   └── dashboard/          # Dashboard-specific components
└── lib/
    ├── mermaidGenerator.ts # Transforms IBM Bob JSON → Mermaid ER syntax
    └── utils.ts            # Shared utility functions
```

## 🎨 Design System

- **Background:** Deep Charcoal (`#0A0A0A`)
- **Primary Accent:** Electric Blue (`#0062FF` — IBM Brand)
- **Text:** Soft Gray (`#A8A8A8`) on dark surfaces
- **Effects:** Glassmorphism cards, subtle gradient borders
- **Typography:** Figtree (via Shadcn Maia preset)

## 🏆 IBM Bob Hackathon

This project was built during the [IBM Bob Hackathon](https://lablab.ai/ai-hackathons/ibm-bob-hackathon) on lablab.ai (May 15–17, 2026).

### Team
- **Benjamín Ayala** — Architecture Lead & Project Strategy
- **Oscar Lindo** — Frontend Lead & AI Integration

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
