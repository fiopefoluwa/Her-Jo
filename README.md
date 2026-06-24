# HerJo — The Digital Fabric of Trust

A culturally grounded fintech platform that modernizes traditional African savings circles (Ajo/Esusu) with a unique Trust Score system, fostering financial collaboration and cultural connection.

## Project Structure

```
├── frontend/     # React + JavaScript + Tailwind CSS (Vite)
├── backend/      # Express.js REST API
├── guidelines/   # Design system guidelines
└── ATTRIBUTIONS.md
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens at `http://localhost:5173`

### Backend
```bash
cd backend
npm install
npm run dev
```
Runs at `http://localhost:3001`

## Features

- **Landing Page** — Hero, how-it-works explainer, trust system showcase
- **Dashboard** — User stats, savings circles overview, trust score visualization
- **Circle Page** — Rotation journey timeline, member list, contribution history
- **Trust Score** — SVG-animated pot visualization that grows with contributions
- **REST API** — Express.js backend with user, circle, and contribution endpoints

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix primitives) |
| Animation | Framer Motion |
| Routing | React Router v7 |
| Backend | Express.js, Node.js |
| Icons | Lucide React |

## Original Design

Based on the Figma design: [Culturally Grounded Fintech Design](https://www.figma.com/design/yTkgLzyfNbtRlZivllMGiA/Culturally-Grounded-Fintech-Design)