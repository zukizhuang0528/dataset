# Design Guidelines

This document defines the product-wide design rules for this repository. It is the source of truth for future page implementation and visual refinement.

## Product Scope

- This is an English-language admin product.
- All user-facing UI content must be written in English.
- Chinese PRDs, prototypes, comments, or requests are treated as input only.
- The visual direction is light, operational, structured, and enterprise-oriented.
- The UI should feel branded, but readability and execution clarity always come first.

## Non-negotiable Rules

- The entire site must remain in English unless a future page explicitly requires bilingual support.
- Spacing values must always be integers and multiples of 4.
- Do not introduce a second component library. Reuse the existing shadcn/ui-based system.
- Do not add sections, widgets, or content blocks that are not present in the approved prototype, unless explicitly requested.
- Do not reintroduce brand blue as a primary visual color.
- Prefer extending shared primitives over page-local styling.
- Do not add page-specific CSS files unless a reusable primitive cannot express the design.
- When a layout pattern appears more than once, extract it into a shared primitive instead of copying class strings.

## Brand Foundation

### Core Brand Colors

- Primary: `#8B5CF6`
- Secondary: `#D946EF`
- Brand gradient: `linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)`

### Brand Color Usage

Use the brand gradient only for:

- Primary call-to-action buttons
- Small branded icon backgrounds
- Current-step emphasis in key flows
- Small high-priority highlights

Do not use the brand gradient for:

- Full-page backgrounds
- Standard cards
- Normal table rows or cells
- Standard input backgrounds

## Color System

### Neutral Layers

- Page background uses a very light neutral tone
- Main surfaces use white or near-white
- Borders use subtle neutral gray
- Text hierarchy uses dark gray and muted gray

### Semantic Status Colors

Use status colors consistently across the entire product:

- Blue: in progress, processing, active workflow state
- Green: completed, enabled, available, successful
- Red: disabled, blocked, danger, error, alert
- Gray: unavailable, inactive, neutral, not ready

### Status Display Rules

- Use pill-style status labels for statuses in tables and list views
- Use light tinted backgrounds with darker readable text
- Do not use plain text-only status unless space is extremely constrained
- Do not introduce page-specific status color mappings that conflict with this system

## Typography

### Font Families

- Sans: `Poppins`
- Mono: `JetBrains Mono`

### Font Usage

Use `Poppins` for:

- Page titles
- Section titles
- Labels
- Buttons
- Table headers
- Body copy

Use `JetBrains Mono` for:

- Dataset IDs
- Accounts
- Codes
- Timestamps where scanning precision matters
- Structured values and machine-readable strings

### Typography Hierarchy

- Page title: `32px`, `600`
- Section title: `24px`, `600`
- Card title: `20px`, `600`
- Body text: `14px` or `16px`
- Secondary text: `12px` or `14px`
- Table text: `14px`
- Mono data: `12px` or `14px`

## Spacing System

### Base Rule

All spacing must be:

- an integer
- a multiple of 4

### Standard Spacing Scale

- `4`
- `8`
- `12`
- `16`
- `20`
- `24`
- `28`
- `32`
- `40`
- `48`

### Typical Usage

- Label to field: `8`
- Inline item gap: `8`
- Small control group gap: `12`
- Standard component gap: `16`
- Major content block gap: `24`
- Large section gap: `32`
- Standard card padding: `16` or `24`
- Standard page side padding: `24`

## Radius, Border, and Shadow

### Radius

- Small controls: `12`
- Standard cards: `16`
- Large containers: `24`
- Pills and badges: full radius

### Borders

- Standard border width: `1px`
- Border color should stay neutral and light
- Use brand-tinted borders only for selected or emphasized states

### Shadows

Shadows must stay subtle and neutral gray.

Use shadows to establish hierarchy, not decoration.

- Standard cards: light shadow
- Emphasized surfaces: moderate shadow
- Popovers and overlays: slightly stronger than standard cards

Do not use:

- purple-tinted shadows
- blue-tinted shadows
- heavy, oversized floating shadows

## Layout Patterns

### Global Layout

- Fixed expanded sidebar
- Sticky top header
- Main content area centered on function-first sections

### Standard Page Pattern

1. Page title and short description
2. Filter or query area, if needed
3. Primary and secondary action area
4. Main content area
5. Supporting content only if the prototype requires it

### Shared Page Primitives

Prefer using the shared page-level primitives in:

- `src/components/layout/admin-page-primitives.tsx`

Current shared primitives:

- `AdminPageHero`
- `AdminSurface`
- `AdminSectionHeader`
- `AdminFilterLabel`

New admin pages should start from these primitives before adding page-local wrappers.

### Implementation Rules

- Reuse `components/ui` and shared layout primitives before introducing new wrappers.
- Avoid large one-off class blocks in page files when the same visual pattern already exists elsewhere.
- Extract repeated page shells, headers, filter panels, and section wrappers into shared primitives.
- Keep custom CSS close to zero. Prefer Tailwind utilities and shared React primitives over ad hoc stylesheet rules.
- If a page needs a truly new layout pattern, make it reusable by default.
- All mock data shown in product tables should default to a North American business context unless a page explicitly requires another locale.
- All tables must stay constrained to the browser width. If column content exceeds the available space, the table itself must scroll horizontally inside its own container rather than expanding the page canvas.
- Wide tables should define an explicit `min-w-[...]` on the shared `Table` component so the internal horizontal scroll behavior is intentional and predictable.

### Sidebar Rules

- Sidebar stays expanded
- No collapse interaction
- No sidebar collapse trigger in the header
- Top area should show brand identity, not multi-tenant switching
- Sidebar navigation should remain simple and easy to scan

## Buttons

### Button Types

Primary button:

- Brand gradient background
- White text
- Used for the most important action in the current area

Outline button:

- Neutral background
- Border visible
- Used for reset, cancel, batch actions, secondary actions

Ghost button:

- Low visual weight
- Used for row-level actions and utility actions

Danger button:

- Red semantic styling
- Used for destructive or risky actions

### Button Rules

- Only one strongest primary button should dominate a local action group
- Batch operations should usually use outline styling
- Row actions should usually use ghost styling
- Disabled buttons must use the system disabled state

## Form Controls

### Inputs

- Inputs and selects must align in height and radius
- Standard field height should remain consistent within the same form section
- Labels are placed above fields
- Placeholder text must be concise and in English

### Selects

- Selects should visually align with inputs
- Enumerated fields should use selects instead of free text
- Select options must contain real mock data or actual data

### Filter Areas

Filter areas should:

- use a white or near-white surface
- have consistent internal spacing
- use grid layout
- place labels above controls
- place action buttons on the lower-right or right side

## Tables

### Table Structure

- White surface
- Light header background
- Clear borders and rounded outer container
- Hover state should be subtle
- Data should remain highly scannable

### Default Header Rule

- Table headers are sortable by default

If a specific page needs one or more exception columns to open filters or another interaction, that exception should be defined at the page level rather than changing the global table rule.

### Table Content Rules

- Avoid over-nesting inside cells
- Keep content single-line when possible
- Use status pills for statuses
- Use mono text for IDs, accounts, or machine-readable values when helpful
- Time values should use a consistent format

### Selection Rules

- Header checkbox controls visible rows
- Row checkbox controls that row only
- Batch actions must react to current selection
- Batch action buttons must be disabled when no row is selected

## Row Actions

### Usage Scope

This rule applies across all operational tables, not only the current user table.

Examples:

- User management
- Project management
- Data management
- Vendor management
- Template management
- Task or workflow tables

### Row Action Style

- Prefer `icon + text`
- Prefer ghost-style buttons for low-weight row actions
- Keep actions aligned horizontally when space allows

### Common Row Actions

- View
- Edit
- Disable / Enable
- Assign
- Review
- Configure
- Run
- Retry
- Delete
- Export

### Row Action Rules

- Do not default to icon-only row actions
- Keep order consistent within the same page
- Disabled actions should appear disabled rather than disappear unless the prototype explicitly requires hiding them

## Popovers and Local Filters

Use popovers for:

- column-level filters
- lightweight settings
- compact confirmation-like interactions that do not require a full dialog

Popover content should usually contain:

- one compact control group
- one or two actions
- clear close behavior

## Component State Rules

### Buttons

- default
- hover
- focus
- disabled

### Inputs and Selects

- default
- focus
- filled
- disabled
- error when needed

### Table Rows

- default
- hover
- selected

### Status Tags

- blue semantic
- green semantic
- red semantic
- gray semantic

## Page-Type Guidance

### List Pages

Examples:

- User Management
- Project Management
- Vendor Management
- Data Management
- Template Management

Recommended structure:

- title
- filter area
- action area
- table

### Detail Pages

Examples:

- dataset detail
- project detail
- vendor detail

Recommended structure:

- page header
- lifecycle or summary block if required
- main content sections
- side summary only if the prototype requires it

### Configuration Pages

Examples:

- auto-label config
- template config
- project settings

Recommended structure:

- main configuration area
- summary or result panel only if needed
- clear action zone at the bottom or side

## Language Rules

- All interface copy must be English
- Page titles use Title Case
- Buttons use short Sentence Case
- Labels are concise and clear
- Placeholders should use patterns like `Enter ...` or `Select ...`

## Current Implementation Reference

Theme and token reference:

- [src/styles/themes/annotate-flow.css](../src/styles/themes/annotate-flow.css)

Layout reference:

- [src/components/layout/app-sidebar.tsx](../src/components/layout/app-sidebar.tsx)
- [src/components/layout/header.tsx](../src/components/layout/header.tsx)
- [src/components/layout/page-container.tsx](../src/components/layout/page-container.tsx)

Page reference:

- [src/features/datasets/components/dataset-listing-page.tsx](../src/features/datasets/components/dataset-listing-page.tsx)
- [src/features/datasets/components/dataset-detail-page.tsx](../src/features/datasets/components/dataset-detail-page.tsx)
- [src/features/people/components/user-management-page.tsx](../src/features/people/components/user-management-page.tsx)

## How To Use This Document

- Treat this file as the design source of truth for future pages
- Reuse existing tokens and primitives before introducing new visual rules
- Add page-level exceptions only when the prototype or business rule clearly requires them
- Keep this file focused on design rules; future project context documents can live alongside it in `docs/`
