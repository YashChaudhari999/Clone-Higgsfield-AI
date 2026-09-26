IMPORTANT CHANGE IN PRODUCT DIRECTION

The original reference product is Higgsfield, but this assignment is explicitly evaluating our own product decisions.

Do NOT make the current application a pixel-perfect Higgsfield clone.

Keep the existing backend, API, database and working functionality wherever possible.

Rework the frontend into our own product called Forgefield.

PRODUCT CONCEPT:

Forgefield is a focused AI creative workspace for organizing creative projects, briefs, references and assets.

The product should be inspired by the strengths of Higgsfield, but it must have its own information architecture, layout, visual system and interaction design.

CORE PRODUCT FLOW:

Home
→ Create Project
→ Project saved through the REAL backend/API
→ Project stored in the REAL database
→ Project appears in Projects
→ Open Project
→ View/edit project information and assets
→ Explore other creative work

IMPORTANT:
The backend MUST remain real and connected.

Do not replace API/database operations with mock data, local-only arrays or hardcoded responses.

FIRST PRIORITY:

Redesign the frontend information architecture.

Use a simple navigation:

- Home
- Projects
- Explore
- Create

Do not reproduce Higgsfield's large navigation bar.

SECOND PRIORITY:

Create a strong first-time experience.

The Home page should immediately communicate:

"Forgefield helps creators turn ideas into organized creative projects."

Include:

- clear hero
- primary Create Project CTA
- recent projects
- creative inspiration
- useful project statistics where appropriate

THIRD PRIORITY:

Build a polished Create Project experience.

The form should use the existing real API.

At minimum support:

- project name
- creative brief/description
- creative direction/category
- optional reference image if the existing backend supports it

On submission:

Frontend
→ real API
→ real database
→ successful response
→ update UI

FOURTH PRIORITY:

Build a polished Projects page.

Projects must come from the real backend/database.

Support:

- project listing
- project detail
- useful metadata
- opening a project
- editing existing project information if the API supports it

FIFTH PRIORITY:

Build an Explore page inspired by the discovery aspect of Higgsfield, but with our own layout.

Use real accessible visual assets where appropriate.

Do NOT copy Higgsfield's exact section structure.

Create our own visual hierarchy and card system.

VISUAL DIRECTION:

Create a distinctive premium creative-tool interface.

Use:

- dark foundation
- neon-lime accent
- strong typography
- generous spacing
- subtle borders
- sophisticated cards
- high-quality imagery
- smooth but restrained animations

Do not copy Higgsfield's exact layouts.

Do not use default HTML styling.

Do not use generic dashboard templates.

The interface should feel designed specifically for Forgefield.

PRODUCT JUDGMENT:

Prefer 3-5 polished, functional workflows over 20 fake features.

Do not create fake AI generation functionality merely for visual appearance.

If an AI capability is not actually implemented by the backend, represent it honestly as a future capability or make the workflow about organizing creative work instead.

IMPORTANT ENGINEERING CONSTRAINTS:

- Preserve the existing backend.
- Preserve the existing database.
- Preserve existing working API endpoints.
- Do not introduce unnecessary dependencies.
- Do not rewrite working backend code unless required.
- Do not hardcode project data into the frontend.
- Do not use mock API responses in the final product.
- Do not expose secrets.
- Keep the application deployable.

RESPONSIVE:

The product must work properly at:

1440px
1280px
1024px
768px
390px

Mobile should have an intentionally designed layout, not simply a compressed desktop layout.

FINAL REQUIREMENT:

After implementation, run the application and test the complete real flow:

Create project
→ database
→ API response
→ project appears
→ refresh page
→ project still exists
→ open project
→ edit/update
→ verify persistence

Then perform a visual QA pass.

Do not add unnecessary features.

Optimize for:

1. Product judgment
2. Working functionality
3. UX/UI quality
4. Clean engineering
5. Speed of execution

The final result should clearly look like a product we designed ourselves after studying Higgsfield, not a clone of Higgsfield.







IMPORTANT BACKEND / DATABASE DECISION

Use SUPABASE as the cloud backend database for Forgefield.

Do NOT use local MySQL, XAMPP, SQLite, mock JSON data, local arrays, or browser-only storage for persistent application data.

Use:

- Supabase PostgreSQL for relational data
- Supabase Storage for uploaded project/reference images
- Supabase Auth if authentication is required
- Supabase client/API for frontend-to-database communication

The database must be hosted in Supabase so the deployed application works independently of my local machine.

ARCHITECTURE:

Frontend
   ↓
Supabase client
   ↓
Supabase PostgreSQL
   ↓
Persistent cloud data

For images:

Frontend
   ↓
Supabase Storage
   ↓
Public/signed asset URL
   ↓
Database stores the image URL/reference


IMPORTANT:

The deployed application must use the Supabase production project, not a local database.

Do not hardcode fake projects or fake API responses.

Do not create a local fallback database.

Do not use mock data in the final production flow.

DATABASE DESIGN

Create a clean relational schema appropriate for the current Forgefield product.

At minimum:

profiles
- id
- display_name
- avatar_url
- created_at
- updated_at

projects
- id
- user_id
- name
- description
- category
- status
- cover_image_url
- created_at
- updated_at

project_assets
- id
- project_id
- user_id
- name
- file_url
- file_type
- created_at

project_notes
- id
- project_id
- user_id
- content
- created_at
- updated_at

Use UUID primary keys where appropriate.

Use foreign keys between related tables.

Add created_at and updated_at timestamps.

Use appropriate indexes for user_id and project_id.

SECURITY

Configure Supabase Row Level Security.

A user must only be able to access their own private projects, assets and notes.

Do not expose the Supabase service-role key in the frontend.

Only use the public/anon key on the client where appropriate.

Store environment variables correctly.

Never commit secrets to GitHub.

IMAGE STORAGE

Create a Supabase Storage bucket for project/reference assets.

When a user uploads an image:

1. Upload the actual file to Supabase Storage.
2. Obtain the resulting asset URL/path.
3. Save the asset metadata and URL/path in project_assets.
4. Display the real stored image in the frontend.

Do not convert uploaded images into hardcoded base64 data.

Do not fake uploads.

PROJECT CREATION FLOW

The following must be a REAL end-to-end flow:

User opens Create Project
        ↓
Enters project name
        ↓
Enters description
        ↓
Selects category
        ↓
Optionally uploads image
        ↓
Clicks Create Project
        ↓
Supabase Storage upload if image exists
        ↓
Insert project into Supabase PostgreSQL
        ↓
Insert asset record if applicable
        ↓
Return successful response
        ↓
Navigate to project
        ↓
Project appears in Projects page

PROJECT LIST

Projects page must query Supabase directly.

Example conceptual flow:

supabase
  → projects
  → current user's projects
  → render real records

Do NOT use:

const projects = [...]

or other hardcoded project collections for the final experience.

PROJECT DETAIL

Opening a project should retrieve the project from Supabase.

Display:

- project name
- description
- category
- status
- cover image
- assets
- notes
- created/updated information

If editing is implemented, updates must persist to Supabase.

After refreshing the browser, the changes must still exist.

TEST THE DATABASE PERSISTENCE

After implementing the Supabase integration, test this exact scenario:

1. Create a project.
2. Confirm it appears in Supabase.
3. Refresh the application.
4. Confirm the project still appears.
5. Open the project.
6. Update the project.
7. Refresh again.
8. Confirm the updated data persists.
9. Upload an image.
10. Confirm the file exists in Supabase Storage.
11. Confirm the image displays after refreshing.

This is critical because the evaluator specifically said the backend must be real and connected.

ENVIRONMENT VARIABLES

Use environment variables such as:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

or the equivalent environment-variable naming convention for the current framework.

Create/update the appropriate .env.example file.

Never commit the actual .env file or secrets.

DEPLOYMENT

The deployed application must connect to the same Supabase cloud project.

Do not make the deployed version depend on:

- localhost
- XAMPP
- local MySQL
- local files
- development-only mock APIs

The evaluator should be able to open the live URL from a completely different machine and create/read/update real data.

IMPORTANT PRODUCT CONSTRAINT

Do not turn this into a huge application.

Keep the core product focused:

Home
→ Create Project
→ Projects
→ Project Detail
→ Explore

Prioritize a small number of complete, real workflows over many fake features.

Use the existing Forgefield frontend direction and continue improving its original visual design.

The product should be clearly inspired by the creative workflow ideas discovered while studying Higgsfield, but it must NOT be a pixel-perfect clone.

Before finishing:

- Verify Supabase connection.
- Verify database tables.
- Verify RLS.
- Verify Storage.
- Verify project CRUD/persistence.
- Verify image upload.
- Verify production build.
- Verify deployed application.
- Verify there are no hardcoded production project records.
- Verify there are no exposed secrets.