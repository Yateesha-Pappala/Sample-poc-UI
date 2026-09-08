# App Starter Template

An Angular 21 UI starter that carries a ready-made design system, layouts, a set
of generic components, and example pages. Fork it to start a new project with a
UI that's consistent with the Self-Service Portal and every other project built
from this template.

It is **not** a redesign — the visual language, components and states are lifted
directly from the portal. See [`docs/ANALYSIS.md`](docs/ANALYSIS.md) for exactly
what was kept, refactored, or dropped.

- Angular 21, standalone components, signals, `OnPush`, lazy routes
- Tailwind v4 (CSS-first) + a shared `.sui-*` component layer
- Class-based dark mode
- Vitest for unit tests, Prettier for formatting
- A `Dockerfile` that serves the SPA on `$PORT`, ready for the portal's iframe

---

## 1. What's in the box

```
src/app/
  core/            singletons: theme, http (ApiClient/Loading), tour, auth stub, app-config
  models/          shared interfaces (User, NavItem)
  layouts/         app-shell, auth-navbar, back-header
  shared/components/   ~22 generic components (see the /components page in the running app)
  pages/           10 example pages wired to in-memory mock data
  app.routes.ts    route table
src/styles/        the shared design layer — see docs/DESIGN-LAYER.md
docs/              ANALYSIS, DESIGN-LAYER, PORTAL-INTEGRATION
Dockerfile, nginx/ container that serves the build on $PORT
```

Run it and open **`/components`** — a living style guide showing every `.sui-*`
class and shared component in both themes.

```bash
npm install
npm start          # http://localhost:4200
npm test           # Vitest
npm run build      # production build → dist/app/browser
```

---

## 2. Create a new project from it

```bash
# degit keeps none of this repo's git history
npx degit <this-repo> my-project
cd my-project
git init && git add -A && git commit -m "Start from app-starter-template"
npm install
```

Then work through steps 3–7 below. Search the codebase for `TODO(branding)` and
`TODO(project)` — they mark every spot that expects a project-specific value.

---

## 3. Application name

One place: [`src/app/core/app-config.ts`](src/app/core/app-config.ts) →
`DEFAULT_APP_CONFIG.appName` (defaults to `Sails Software`). It shows next to the
logo in the shell and the auth navbar. Also update `<title>` in
[`src/index.html`](src/index.html).

---

## 4. Logo

The template ships the **Sails Software** mark (same inline SVG the portal uses)
in [`src/app/shared/components/logo/logo.ts`](src/app/shared/components/logo/logo.ts)
and the favicon at [`public/sails logo fevvicon.jpg`](public/sails%20logo%20fevvicon.jpg).
For a non-Sails project, replace the inline `<svg>` and the favicon — keep the
`<app-logo>` component and its `name` input; the shell and auth navbar consume it.

---

## 5. Branding / colours

Edit [`src/styles/_branding.css`](src/styles/_branding.css) — change the hex
values of the `--color-brand-*` tokens. Everything (`.sui-btn--primary`, links,
active nav, focus rings, charts, badges) follows. Full detail:
[`docs/DESIGN-LAYER.md`](docs/DESIGN-LAYER.md).

Don't edit `theme.css` or `components.css` — they're the shared layer.

---

## 6. Navbar navigation

[`src/app/core/app-config.ts`](src/app/core/app-config.ts) → `navItems`. Each
`NavItem` is `{ label, route?, badge?, queryParams?, adminOnly? }`. Order is
render order; `adminOnly` items are hidden unless `ExampleAuthService.isAdmin`.
The shell renders them as the horizontal tab nav and the mobile slide-down.

---

## 7. Sidebar navigation

There is **no sidebar** — the portal's primary navigation is the horizontal tab
bar in the header (see step 6), and this template matches it. If your project
needs a sidebar, add it as a new layout under `src/app/layouts/` using the same
tokens and `.sui-*` classes; don't change `app-shell`.

---

## 8. Add a page

1. Create `src/app/pages/<name>/<name>.ts` (+ `.html`), standalone, `OnPush`.
2. Add a lazy route in [`src/app/app.routes.ts`](src/app/app.routes.ts). Put it
   under the `AppShell` children for an in-shell page, or top-level for a
   standalone one.
3. Add a `NavItem` (step 6) if it belongs in the nav.
4. For data, write a service that returns `ApiResult<T>` (see
   `core/http/api-client.ts`) and, until the backend exists, a mock like
   `pages/shared/*.mock-service.ts`.

Copy the closest example page as a starting point.

---

## 9. Use the shared components

Import the standalone component and drop it in. Every component has a usage
example in its file-level doc comment, and the `/components` page shows them all
assembled. Highlights:

| Need                                   | Component                                                          |
| -------------------------------------- | ------------------------------------------------------------------ |
| Primary/secondary/danger button        | `.sui-btn` classes (no wrapper)                                    |
| Text / select / textarea               | `.sui-input` / `.sui-select` / `.sui-textarea`                     |
| Search field                           | `<app-search-input [(value)]>`                                     |
| Catalog card + grid                    | `<app-resource-card>` inside `<app-card-grid>`                     |
| Table + pagination                     | `<app-data-table>` + `<app-pagination>`                            |
| Tabs / segmented toggle / filter chips | `<app-tab-bar>` / `<app-segmented-control>` / `<app-filter-chips>` |
| Dropdown select-and-filter             | `<app-combobox>`                                                   |
| KPI tile / ranked bars / line chart    | `<app-stat-tile>` / `<app-bar-list>` / `<app-line-chart>`          |
| Confirm / form modal                   | `<app-confirm-dialog>` / `<app-form-dialog>`                       |
| Empty / error state                    | `<app-empty-state>` / `<app-error-state>`                          |
| One-time-code entry                    | `<app-otp-input>`                                                  |
| Icons                                  | `<app-icon name="…">`                                              |
| Product tour                           | `Tour` service + steps; overlay is already mounted                 |

---

## 10. What NOT to modify

| Leave alone                                                                               | Why                                                                                                                         |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/theme.css`, `src/styles/components.css`                                       | Shared design layer, kept in sync via subtree. Rebrand in `_branding.css`.                                                  |
| `src/app/shared/components/**`                                                            | Generic building blocks. Extend via inputs/outputs/projection, or add a new component beside them — don't fork the visuals. |
| `src/app/layouts/app-shell/**`                                                            | Configurable via `APP_CONFIG` + `ExampleAuthService`. Change behaviour through those, not the template.                     |
| `Dockerfile`, `nginx/default.conf.template`                                               | Tuned for the portal's iframe + `$PORT`. See `docs/PORTAL-INTEGRATION.md` before touching.                                  |
| `core/http/api-client.ts`, `core/http/loading*.ts`, `core/tour/**`, `core/scroll-lock.ts` | Generic infrastructure — reuse as-is.                                                                                       |

---

## Template vs Project-Specific Code

**Template code** — comes from this repo, updated by pulling template/subtree
changes, kept generic:

- `src/styles/theme.css`, `src/styles/components.css`
- `src/app/core/**` except `app-config.ts`
- `src/app/layouts/**`, `src/app/shared/**`
- `src/app/models/**`
- `Dockerfile`, `nginx/**`, tooling configs, `.claude/CLAUDE.md`, `AGENTS.md`

**Project-specific code** — you own and change freely per project:

- `src/styles/_branding.css` (palette)
- `src/app/core/app-config.ts` (name + nav)
- `src/app/core/auth/**` (replace the stub with real auth)
- `src/app/shared/components/logo/logo.ts`, `public/sails logo fevvicon.jpg` (only if not a Sails project)
- `src/app/pages/**` (replace the examples with your screens)
- `src/app/pages/shared/**` (mock services → real services)
- `src/environments/**` (`apiUrl`)
- `src/app/app.routes.ts` (your routes)

The example pages under `src/app/pages/` are **demonstrations**. Delete the ones
you don't need once your real screens exist — but keep `not-found`, and keep the
`/components` route around as a reference while you build.

---

## Conventions

Enforced by `.claude/CLAUDE.md` / `AGENTS.md` and `tsconfig.json` strictness:
standalone components, `input()`/`output()`, `computed()` for derived state,
`inject()`, `OnPush`, native control flow (`@if`/`@for`), `class`/`style`
bindings (no `ngClass`/`ngStyle`), reactive forms. Accessibility is a
requirement, not a nice-to-have — every shared component ships with the ARIA and
focus behaviour the portal uses.
