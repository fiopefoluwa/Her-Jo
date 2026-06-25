# Frontend Restructure (React)

## Planned steps
- [ ] Inspect existing frontend routing + page components.
- [ ] Move LandingPage, Dashboard, CirclePage into `src/pages/`.
- [ ] Keep reusable UI pieces in `src/components/` (WovenDivider, TrustScore, ImageWithFallback, ui primitives).
- [ ] Ensure `src/pages/Home.jsx` is used for the `/` route (rename/move if needed), and remove duplicate/unused Landing page file.
- [ ] Refactor `src/App.jsx` to contain only React Router configuration.
- [ ] Move Toaster out of `src/App.jsx` into `src/main.jsx`.
- [ ] Remove `src/routes.jsx` and update imports.
- [ ] Fix any broken imports after moving files.
- [ ] Build the frontend and verify routes: `/`, `/dashboard`, `/circle/:id`.
- [ ] Clean up unused imports/files.

