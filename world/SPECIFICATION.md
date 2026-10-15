# Manav’s World — Portfolio specification

## Experience
An interactive Mac-inspired personal desktop built with React and Vite. Visitors enter from a welcome screen and explore a starry wallpaper, dock, desktop shortcuts, and app windows.

## Apps and interactions
- About: a lavender introduction with professional background and direct paths to work, poetry, and contact.
- Projects: a compact gallery and individual FoodFreaky, CIDA, and Dora The Explorer case studies, feature specifications, architecture illustrations, technology stacks, and outcomes from the supplied résumé or project source.
- Music: seven personal favourites hosted on S3, plus optional local audio files. Includes song and artist labels, playlist selection, play/pause, previous/next, seeking, automatic continuation, and a persistent desktop mini player. Playback continues when its window is closed or minimized. Songs load only after the visitor presses play. Loading and unavailable states are shown in the player. All seven S3 files currently respond successfully to anonymous audio requests; configuration details are in MUSIC_SETUP.md.
- Notes: clearly labelled sample quotes pending personal content.
- Literature & Poetry: dedicated desktop app with poetry, prose/reflections, and reading notes. First poem: “Are we even friends?”, transcribed from Manav’s handwritten page dated 23 December 2024. Second poem: “A faithful goodbye” (display title drawn from its refrain), supplied directly in chat. Prose and reading notes await personal selections.
- Terminal: help, whoami, clear, and commands to open apps.
- Contact: email, LinkedIn, and GitHub links.
- Résumé: career summary and original PDF, an Education tab with all three qualifications, and a Certifications tab with issuer cards, issue dates, skills, and credential links. About opens Certifications directly; app search finds the relevant tab using “education”, “certifications”, or “credentials”.
- Windows: drag on desktop, close, minimise, restore from dock, centre, maximize/restore, and resize from all edges or corners. Window options offer larger/smaller presets. Bounds keep controls within the desktop; resized content scrolls. Minimizing preserves app state. Mobile shows one active app fitted between the menu and dock.
- Desktop: matched original SVG icons, a purple M-and-star favicon with SVG/ICO and Apple touch variants, compact dock, app search with Command/Ctrl+K and keyboard focus handling, wallpaper theme switch, clock, responsive layout, reduced-motion support.
- Poetry reader: original poem text and Georgia typography on ivory paper, one poem at a time, library selection, previous/next navigation, and focus mode. Selecting a poem scrolls its reading area to the beginning without shifting the desktop.

## FoodFreaky
- Domain: https://foodfreaky.in
- Role: co-founder; backend development and production deployment.
- Audience: college students.
- Features: browse food, place orders, track order status, digital PDF invoices, and transactional emails.
- Authentication: JWT with user/admin role-based access.
- Stack: MERN (MongoDB, Express, React, Node.js).
- Deployment: DigitalOcean, Cloudflare, Netlify.
- Résumé-reported outcomes: 1,000+ users and ₹6L+ revenue.

## CIDA
- Purpose: search, summarize, and ask contextual questions about uploaded documents.
- Backend: Python / FastAPI, asynchronous document processing.
- Retrieval: document chunking, vector embeddings, similarity-based retrieval.
- Generation: Google Gemini API using retrieved context.
- Refinement: chunking and similarity-threshold tuning.

## Dora The Explorer
- Repository: https://github.com/manava10/DoraTheExplorer
- Purpose: a lightweight browser-based AI chat workspace.
- Stack: React, Vite, JavaScript, and the Google Gemini REST API.
- Features: streamed replies, Markdown rendering, model selection, new conversations, and a recent-conversations sidebar.
- Persistence: up to 20 recent conversations and model preferences stored in browser localStorage.
- Details checked against the repository README and src/main.jsx on 16 October 2026. File attachments and saved thoughts are marked as future work in that source and are not listed as completed features.

## Education
- Vellore Institute of Technology · Bachelor of Technology – BTech, Computer Science · September 2022 – May 2026 · Grade 8.8. Activity: Badminton. Visible skills: DSA and Problem Solving Using Python.
- Sri Viswasanthi Educational Institutions · Matriculation (CBSE) · Grade A1, 96.2%. Activities: Elocution, Storytelling, Cricket, Cosmology. Skill: Mathematics.
- Sri Viswasanthi Educational Institutions · Intermediate, Physics/Chemistry/Mathematics · Grade 95.6%. Activities: Yoga, Badminton, Cricket, Poetry, Hindi Debate, Speed Math.
- Details match the education screenshot supplied on 13 October 2026. School dates and the four collapsed university skills were not shown and are left unspecified. The supplied résumé PDF remains the original document.

## Certifications
- Microsoft Certified: Azure AI Fundamentals · Microsoft · issued May 2026 · credential ID ITS-50827269.
- Credential: https://www.credly.com/badges/06d5440c-41bf-4a8b-b11b-37cbb3192e18/public_url
- Postman API Fundamentals Student Expert · Postman · issued October 2025. Skills: API Testing, Postman API. Details supplied in the user's screenshot; no credential ID was provided.
- Credential: https://badgr.com/public/assertions/7dntsEUMSIuMl4NGErPmGA
- BlackBuck FullStack Developer (MERN) · TaPTaP by Blackbucks · issued May 2025 · credential ID BBCC2025VIT000498. Skills: Full-Stack Development, MERN Stack. Details supplied in the user's screenshot.
- Certificate: https://drive.google.com/file/d/1pNomyt670LE4ncMwDHqeXr3krs4vPKgc/view
- 100xDevs Full Stack with DevOps · 100xDevs · issued August 2024, as supplied in the user's screenshot.
- Certificate: https://drive.google.com/file/d/16h8duX2L0jUi780LuMv6Ul0_JZsYcLPT/view?usp=sharing
- The Microsoft badge confirms Manav Mehta and a May 10, 2026 issue date. The supplied 100xDevs image has blank recipient and date fields; its card uses the user's screenshot details. The cards do not add an independent verification claim.

## Current status
Local preview and production build are available. No hosted version has been published. Hosting awaits the user's approval after review. Personal quotes are pending; the seven supplied songs are configured and their S3 URLs respond successfully. Project facts are based on the user-provided résumé; the FoodFreaky domain was supplied directly by the user. Domain availability has not been verified.

## Run
npm install
npm run dev -- --port 5173
npm run build
node --test src/lib/windowGeometry.test.mjs

Use http://127.0.0.1:5173 for this project. Another local app can occupy localhost on a different network interface.

## Contact, battery, and analytics
About uses a purple theme. Battery menu shows real browser-provided level and charging status when supported, or an unavailable notice. Contact form validates fields and opens an email draft; no backend message storage is configured. Optional Cloudflare Web Analytics and Umami settings are in .env.example; choose one provider. Tracking is disabled until configured. MongoDB integration would require a server endpoint and server-side credentials, never a database connection string in the browser.
