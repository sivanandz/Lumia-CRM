# Lumina Wealth CRM - Zero to Hero Documentation

**Version:** 1.0-alpha  
**Status:** Prototype / Frontend-First  
**Tech Stack:** React 19, TypeScript, Tailwind CSS, Framer Motion, Google GenAI SDK

---

## 1. Overview

**Lumina Wealth CRM** is a next-generation financial advisor platform designed for High Net-Worth Individual (HNI) management in the Indian market. It differentiates itself through a "Liquid Glass" UI aesthetic and deep integration with **Google Gemini** for multi-modal intelligence (Reasoning, Live Voice, Search Grounding, and Maps).

This document serves as the **Single Source of Truth** for the application's architecture, features, data models, and development roadmap.

---

## 2. System Architecture

The application is a client-side React Single Page Application (SPA). It currently uses local state management but is architected to connect to backend services easily.

```mermaid
graph TD
    User[Financial Advisor] -->|Interacts via GUI| App[React App]
    App -->|State Mgmt| LocalState[In-Memory Store]
    
    subgraph AI_Layer [Gemini Intelligence]
        App -->|Text Queries| GeminiPro[Gemini 3.0 Pro]
        App -->|Grounding| GeminiFlash[Gemini 2.5 Flash]
        App -->|Audio Stream| GeminiLive[Gemini Live API]
        
        GeminiFlash -->|Tool| GoogleSearch[Google Search]
        GeminiFlash -->|Tool| GoogleMaps[Google Maps]
    end
    
    subgraph External_Simulations [Mock Integrations]
        App -->|Simulated| GDrive[Google Drive]
        App -->|Simulated| GCalendar[Google Calendar]
    end
```

---

## 3. Data Models & Entities

The application relies on strict TypeScript interfaces defined in `types.ts`. Below is the entity relationship diagram.

```mermaid
classDiagram
    class Client {
        +string id
        +string name
        +string status
        +string riskProfile
        +number aum
        +string[] tags
        +History[] history
    }

    class History {
        +string id
        +string type
        +string date
        +string description
    }

    class MutualFund {
        +string id
        +string name
        +number nav
        +string category
    }

    class InsurancePolicy {
        +string id
        +string type
        +number premium
        +number cover
    }

    class Task {
        +number id
        +string text
        +boolean done
        +string due
    }

    Client "1" *-- "many" History : contains
    Client .. MutualFund : invests_in (implied)
    Client .. InsurancePolicy : holds (implied)
```

---

## 4. Core Features & Modules

### 4.1. Navigation & UI (`Sidebar.tsx`)
- **Design:** Collapsible sidebar with liquid-glass aesthetics.
- **Animation:** Active tab uses `layoutId="activeTab"` in Framer Motion for a sliding liquid backdrop effect.
- **Routes:** Dashboard, Clients, Funds, Insurance, Calendar, Drive, AI Advisor.

### 4.2. Client Management (`ClientsView.tsx`)
- **Layout:** Split-pane (Master-Detail).
- **List View:** 
  - Compact rows with Avatar, Name, Location.
  - **Fuzzy Search:** Filters by name, email, or tags.
  - **Custom Dropdown:** `GlassDropdown` for filtering by Status (Active/Onboarding), AUM, or Activity.
- **Detail View:**
  - **Header:** Scroll-away header to maximize reading space.
  - **Interactive Elements:** Clickable Phone/Email links, Status toggle button.
  - **Timeline:** Vertical history timeline of interactions.

### 4.3. AI Advisor "Brain" (`AIChat.tsx`)
The central intelligence hub. It is **Context-Aware** but stateless between sessions in this version.

#### Modes
| Mode | Model | Tool | Purpose |
|------|-------|------|---------|
| **Deep Think** | `gemini-3-pro-preview` | `thinkingBudget: 32k` | Complex portfolio strategy, rebalancing, tax planning. |
| **Research** | `gemini-2.5-flash` | `googleSearch` | Real-time market news, regulator circulars, NFO analysis. |
| **Locate** | `gemini-2.5-flash` | `googleMaps` | Finding physical branches, notary services, or meeting points based on GPS. |

```mermaid
sequenceDiagram
    participant User
    participant ChatUI
    participant GeminiService
    participant GoogleTools

    User->>ChatUI: "Find nearby HDFC branch"
    ChatUI->>GeminiService: Mode: 'locate', Lat/Lng
    GeminiService->>GoogleTools: Maps Tool Query
    GoogleTools-->>GeminiService: Places Data
    GeminiService-->>ChatUI: Text + Grounding Metadata
    ChatUI-->>User: Renders Message + Source Links
```

### 4.4. Gemini Live Voice (`LiveVoice.tsx`)
- **Technology:** WebSockets via `@google/genai` SDK (`ai.live.connect`).
- **Audio Pipeline:** 
  1. Browser `MediaStream` -> `AudioContext` (16kHz).
  2. Raw PCM conversion (Float32 to Int16).
  3. Base64 encoding -> Send to Gemini.
  4. Receive Base64 PCM -> Decode -> Playback via `AudioBufferSourceNode`.
- **UI:** A pulsating visualizer orb that changes state based on "Listening", "Processing", or "Speaking".

### 4.5. Mutual Funds & Insurance
- **Funds (`FundsView.tsx`):** List of tracked schemes. 
  - **AI Feature:** "Analyze Fund" button uses Search Grounding to fetch live NAV and performance against benchmarks.
- **Insurance (`InsuranceView.tsx`):** Policy viewer.
  - **AI Feature:** "Policy Decoder" uses Thinking Mode to explain complex terms and exclusions in plain English.

### 4.6. Calendar & Tasks (`CalendarView.tsx`)
- **Global State:** Tasks are lifted to `App.tsx` to be accessible via the Quick Dock.
- **Features:** 
  - Schedule timeline (left pane).
  - Task list with "Done" toggle (right pane).
  - Quick Task add from Floating Dock.

### 4.7. Global Quick Actions
- **Dock:** A floating glass bar at the bottom center.
- **Shortcuts:** Add Client, Create Task, Upload File, Ask AI.
- **Behavior:** Opens modals or switches tabs instantly.

---

## 5. Mock vs. Production Gap Analysis

| Feature | Current State (Mock) | Production Requirement |
|---------|----------------------|------------------------|
| **Data Persistence** | In-Memory Arrays (`App.tsx`) | PostgreSQL / Supabase Database |
| **Authentication** | None (Hardcoded Admin) | OAuth 2.0 / Supabase Auth |
| **File Storage** | Visual Mock Only | Google Drive API / AWS S3 |
| **Calendar Sync** | Hardcoded Events | Google Calendar API (Two-way sync) |
| **Email** | `mailto:` link only | Gmail API integration for history logging |

---

## 6. Installation & Setup

### Prerequisites
- Node.js 18+
- Google Cloud Project with Gemini API enabled.
- API Key with permissions for `gemini-3-pro-preview` and `gemini-2.5-flash`.

### Environment Variables
The app expects `process.env.API_KEY` to be injected by the build environment (or AIStudio runner).

```bash
# For local dev (using Vite)
VITE_API_KEY=your_key_here
```

### Run
```bash
npm install
npm start
```

---

## 7. Roadmap

### Phase 2: The Backend
- Implement Supabase for relational data (Clients, Meetings).
- Move "History" to a dedicated `interactions` table.

### Phase 3: RAG (Retrieval Augmented Generation)
- **Feature:** Upload PDF in Drive tab -> Vectorize -> Store in Vector DB.
- **Usage:** AI Advisor can answer questions based *specifically* on uploaded policy documents.

### Phase 4: Action Agents
- **Feature:** "Schedule a meeting with Rahul next Tuesday" -> AI uses Function Calling to actually create the `Task` and `Calendar Event` objects in the DB.

---

**End of Documentation**
