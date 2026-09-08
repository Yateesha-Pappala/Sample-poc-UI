# The shared design layer (`src/styles/`)

The look of every screen comes from three files:

| File                        | Owns                                                                                                                               | Edit it?                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `src/styles/theme.css`      | `@import "tailwindcss"`, the `.dark` variant, the design **tokens** (`@theme`), base resets (cursors, scrollbars, page background) | **No** — shared, subtree-managed    |
| `src/styles/components.css` | the `.sui-*` component classes (buttons, inputs, card, badges, dialog)                                                             | **No** — shared, subtree-managed    |
| `src/styles/_branding.css`  | a second `@theme` block that **overrides** the token values for this project                                                       | **Yes** — this is where you rebrand |
| `src/styles/README.md`      | the `.sui-*` class reference                                                                                                       | reference only                      |

`src/styles.css` just imports the three in order (`theme` → `_branding` → `components`), and it's the only entry in `angular.json > styles`.

## Rebranding

Open `src/styles/_branding.css` and change the hex values. Every `bg-brand-700`,
`text-brand-accent`, `.sui-btn--primary`, focus ring and chart colour follows.
Nothing else to touch. Restart `ng serve` after editing (Tailwind rescans `@theme`).

## Keeping `theme.css` / `components.css` in sync (git subtree)

These two files are meant to be identical across the portal and every project
built from this template. They're vendored here now; once the shared repo
(`<org>/sui-design`, created with `git subtree split --prefix=src/styles` from the
portal) exists, wire it as a subtree:

```bash
# one-time, replacing the vendored copy:
git rm -r src/styles/theme.css src/styles/components.css src/styles/README.md
git commit -m "Remove vendored design layer ahead of subtree"
git subtree add --prefix src/styles <sui-design-remote> main --squash

# to pull design-layer updates later:
git subtree pull --prefix src/styles <sui-design-remote> main --squash
```

`_branding.css` is **not** part of the subtree — it stays a normal project file,
so `git subtree pull` never clobbers your palette.

> Until the shared repo exists, treat the portal's `src/styles/` as the source of
> truth and copy changes across by hand.
