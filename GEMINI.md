# 🎬 Nande RP StoryBoard - Project Constitution

This document defines the architectural standards, vision, and workflows for the Nande RP StoryBoard project. Gemini CLI (Senior AI Software Architect) must strictly adhere to these principles.

## 🚀 Vision
A "Visual Story Operating System" for GTA 5 FiveM roleplay creators, inspired by Unreal Engine Blueprints and professional cinematic workflows. The goal is to move from manual node editing to an AI-assisted director-style platform where AI generates story drafts and humans refine them.

## 🏗️ Core Systems

### 1. Story Graph Engine
- **Visuals**: React Flow based node-graph.
- **Functionality**: Draggable nodes, branching outcomes, scene flow, camera/event/action nodes.

### 2. Character Memory System
- **Persistence**: Personality, relationships, traits, story history, and emotional states.
- **Consistency**: AI-driven character consistency engine.

### 3. Dialogue System
- **Nuance**: Tone, emotion, and cinematic pacing.
- **Workflow**: Assign dialogue to characters within the graph.

### 4. AI Story Generation (AI-Native Architecture)
- **Pipeline**: AI generates multiple story drafts/scenes/arcs for human review and refinement.
- **Engines**: Narrative planner, dialogue writer, scene sequencer.

### 5. Episode/Timeline System
- **Planning**: Season and episode organization.
- **Sequencing**: Timeline-based progression of story nodes.

## 🛠️ Technical Stack & Architecture

- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS v4.
- **Editor**: React Flow.
- **Backend**: FastAPI (Python).
- **Architecture**: Modular, scalable, and separate UI/editor/business logic. Avoid spaghetti code.

## 🎨 Design Philosophy (Unreal-Inspired UX)
- **NOT** a standard dashboard. **IS** a professional cinematic workspace.
- **Aesthetic**: Dark, high-contrast, professional, similar to Blender or Unreal Engine.

## 📜 Development Rules
1. **Modular First**: Keep components and logic decoupled.
2. **AI-Ready**: Every system should be built with future AI integration (generation/analysis) in mind.
3. **Production-Grade**: Build foundations for a deployable SaaS platform (Auth, DB, Scalability).
4. **Cinematic Workflow**: Prioritize user experience for directors and storytellers.
5. **Documentation**: Explain the "WHY" behind architectural decisions.

## 🚀 Current Roadmap

### Phase 1: Editor & Graph Foundation (Current)
- [ ] Refine visual node styles for cinematic feel.
- [ ] Implement persistent local/backend state for graphs.
- [ ] Enhance node inspector for deep character/scene configuration.

### Phase 2: Character & Dialogue Systems
- [ ] Build the Character Memory schema.
- [ ] Implement dialogue tree logic within the graph.

### Phase 3: Backend & Data Persistence
- [ ] Integrate PostgreSQL (Supabase/Neon).
- [ ] Build the FastAPI CRUD layer for stories/characters.

### Phase 4: AI Integration
- [ ] Implement first-pass AI dialogue suggestions.
- [ ] Build the scene sequencing engine.
