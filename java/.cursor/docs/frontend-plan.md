### LMS Frontend Plan

#### Objectives
- **MVP**: Public course catalog with search.
- **Nice-to-have**: Client-side routing, loading/error states, and basic responsive styling.

#### Tech Choices
- **Framework**: React + TypeScript (fast DX, component model fits LMS UI)
- **Build Tool**: Vite
- **Routing**: React Router
- **Data fetching**: TanStack Query (caching, loading/error states) with `fetch` or `axios`
- **Styling**: Simple CSS modules if preferred

#### Backend Integration
- **API base**: `http://localhost:8080/api` (from Spring `server.servlet.context-path: /api`)
- **CORS**: `@CrossOrigin(origins = "*")` on `CourseController` permits local dev
- **Vite proxy (dev)**: avoid hardcoding origin
  - `vite.config.ts`: `server.proxy = { '/api': 'http://localhost:8080' }`
  - `.env`: `VITE_API_BASE=/api`

#### Target Endpoints (initial)
- `GET /api/courses` — list published + active courses
- `GET /api/courses/search?q=term` — search by title/description

#### Pages and Routes
- `/` → redirect to `/courses`
- `/courses` → Course Catalog (list, search)

#### UI Components (MVP)
- `CourseCard` — title, code, short description, thumbnail
- `CourseList` — grid/list of `CourseCard`
- `SearchBar` — query input tied to `/courses/search`
- `CourseMeta` — code, dates, enrollment capacity (if present)

#### Data Model (client)
```ts
export type Course = {
  id: number;
  title: string;
  description?: string;
  code?: string;
  isActive: boolean;
  isPublished: boolean;
  maxEnrollments?: number;
  startDate?: string; // ISO from backend config
  endDate?: string;
  thumbnailUrl?: string;
  // Optional nested data if provided by the API
  modules?: Array<{ id: number; title: string; orderIndex?: number }>;
  assignments?: Array<{ id: number; title: string; dueDate?: string; maxPoints?: number }>;
};
```

#### State & Fetching
- Use TanStack Query hooks: `useQuery(['courses'])`, `useQuery(['courses', 'search', q])`
- Global state beyond server data is minimal for MVP

#### Styling & UX
- Responsive grid for course cards
- Clear loading and error states
- Empty-state messaging (no courses / no search results)

#### Project Structure
```
frontend/
  src/
    components/
      CourseCard.tsx
      CourseList.tsx
      SearchBar.tsx
    pages/
      CoursesPage.tsx
      NotFoundPage.tsx
    lib/
      api.ts (axios/fetch wrapper)
      types.ts (Course, etc.)
    main.tsx
    App.tsx (routes)
  index.html
  vite.config.ts
  tsconfig.json
  package.json
```

#### Implementation Phases
1) Scaffold app
   - Vite React-TS template, ESLint + Prettier
   - `VITE_API_BASE` env + Vite proxy
2) Data layer
   - API client wrapper, typed responses, query keys
3) Pages & components
   - `/courses`: list + search
4) Polish
   - Loading, error, empty states; basic responsive layout

#### Risks / Considerations
- JPA lazy relations may serialize large nested payloads; if too large, consider DTOs or dedicated endpoints for modules/assignments.
- H2 in-memory DB resets on backend restart—acceptable for dev/demo.
- Add auth later; current demo endpoints are public.

#### Acceptance Criteria (MVP)
- Visiting `/courses` shows published/active courses from the API
- Searching updates results via `/courses/search?q=`
- All network states (loading/error/empty) are visible and usable on mobile and desktop

#### Next Actions
- Confirm stack and proxy approach
- Scaffold `frontend/` and wire `/courses` list against `GET /api/courses`

