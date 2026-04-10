# Dataset UI Adaptation Spec

This starter has been adapted for the data annotation platform using the existing shadcn + dashboard structure instead of creating a separate component library.

## Theme Strategy

- Default theme: `annotate-flow`
- Light-first operational interface
- Font: `Poppins`
- Gradient usage limited to primary CTA, icon badges, and a few highlighted summary surfaces
- Existing shadcn primitives remain the only foundational UI layer

## Theme Files

- `src/styles/themes/annotate-flow.css`
- `src/components/themes/theme.config.ts`
- `src/components/themes/font.config.ts`

## New Feature Module

- `src/features/datasets/`

This module holds business components only:

- dataset listing page
- dataset detail page
- mock dataset data for the first pass

## Routes

- `/dashboard/datasets`
- `/dashboard/datasets/[datasetId]`

## Design Rules

- Use `Card`, `Badge`, `Button`, `Tabs`, `Input`, `Progress`, and `Table` from the existing UI layer
- Do not create parallel replacements for foundational shadcn components
- Keep the background light and neutral
- Use semantic colors for statuses
- Keep English labels short to preserve table density
