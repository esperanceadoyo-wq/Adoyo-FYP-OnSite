# OnSite Project Context

## Project Summary

OnSite is a real-time third-space recommendation system for international students.

A "third space" means an informal learning or social environment outside the classroom, such as a library, cafe, lounge, campus common area, student hub, event venue, or other place where students can meet people, build confidence, and adapt to a new culture.

The project exists to help international students:

- find welcoming places that fit their preferences, comfort level, mood, and learning goals;
- understand unfamiliar social and cultural environments;
- receive real-time or context-aware recommendations;
- reflect after visiting places;
- track progress in confidence, participation, and cultural adaptation;
- stay engaged through points, badges, milestones, or challenges.

## Source Context

Available project documents:

- `P1. CH1. OnSite.pdf` - introduction, problem statement, objectives, scope, schedule, and constraints.
- `P1. CH2. OnSite.pdf` - literature review, existing systems, storyboard, requirements, and competitor comparison.
- `P1. CH3. OnSite.pdf` - methodology, functional/non-functional requirements, architecture, DFDs, and proposed tools.

These are filenames, not guaranteed absolute paths. If this context file is used on another device and the agent needs to inspect the PDFs directly, ask the user where the folder/files are located on that device before trying to read them.

Backend/database direction has now been clarified: use a locally hosted Flask backend with a local SQLite database. This is a final year project, so the goal is a reliable local demo with fewer deployment dependencies, not a cloud-first Supabase-style architecture.

If the actual project repo has an `engineering-codex.md` file or similar engineering brief, still read it before editing so the implementation matches the existing project structure.

## Core Problem

International students often struggle in informal learning and social environments because cultural cues, expected behavior, group norms, and social confidence are not always obvious. Existing campus support services are usually too general, too delayed, or not personalized enough to help in the moment.

OnSite should provide personalized support by recommending appropriate third spaces and using the student's feedback to improve future suggestions.

## Main Users

Primary user:

- International student adapting to a new university/country.

Possible secondary user:

- Admin or university support staff who manages spaces, monitors engagement, and reviews feedback trends.

Admin features are useful, but likely secondary to the student-facing MVP unless explicitly requested.

## Functional Requirements

The expected system features are:

- User registration and authentication.
- Onboarding/profile setup.
- Collection of preferences, comfort level, mood, activity interests, and learning goals.
- Recommendation dashboard for third spaces.
- Recommendation explanations, not just raw results.
- Adaptive recommendation engine based on profile data and user feedback.
- Space details page with atmosphere, amenities, distance, suitability, and guidance.
- Browser-based location use with user consent.
- Mood-based filtering.
- Post-visit reflection and feedback.
- Progress tracking and visualization.
- Gamified rewards such as points, badges, levels, streaks, or challenges.
- General feedback mechanism for improving system quality.

## Non-Functional Requirements

The system should be:

- fast enough to feel responsive, with an approximate target of 2 seconds on a stable connection;
- easy to use for students with different levels of digital literacy;
- responsive across desktop, tablet, and mobile browsers;
- secure with careful handling of user profile, mood, feedback, and location-related data;
- maintainable so recommendation logic and space metadata can evolve;
- reliable enough that users can depend on it for progress and recommendation history;
- privacy-conscious, especially around location and emotional/mood data.

## User Journey

Student journey:

1. Student registers or logs in.
2. Student completes onboarding with interests, comfort level, mood, goals, and preferred activity types.
3. Student optionally grants browser location permission.
4. Student sees recommended third spaces.
5. Student reviews why each space was recommended.
6. Student opens a space details page.
7. Student visits a space.
8. Student submits a post-visit reflection.
9. System updates future recommendation scoring.
10. Student sees progress, points, badges, visit history, and milestones.

Admin journey, if included:

1. Admin logs in.
2. Admin manages third-space records.
3. Admin reviews usage, feedback trends, popular spaces, and engagement.
4. Admin updates space metadata and possibly moderation/approval status.

## Backend Context

The backend is central to the project because it owns identity, user preferences, space data, recommendation scoring, feedback, progress, and gamification.

Chosen implementation direction:

- Backend: Python 3.10+ with Flask.
- Database: local SQLite database file.
- Hosting/deployment: local machine only for development, testing, and final presentation/demo.
- Frontend: can be simple HTML/CSS/JavaScript or the actual frontend stack used by the repo.
- Visualization: Chart.js is acceptable for progress charts if useful, but not mandatory.

This local approach is preferred because it is easier to run, easier to explain, avoids cloud credentials and external service policies, and is sufficient for a final year project prototype.

Before coding, inspect the real repository for files such as:

- `engineering-codex.md`
- `package.json`
- `requirements.txt`
- `pyproject.toml`
- `README.md`
- database schema/migration folders
- API route folders
- environment/config files

If the repo currently has no backend, create a Flask backend. If it already has a different backend, pause and confirm before replacing it.

## Local Flask And SQLite Architecture

Recommended local architecture:

- Flask app exposes JSON API routes under something like `/api/...`.
- SQLite stores all persistent project data in a local database file, for example `instance/onsite.db` or `data/onsite.db`.
- A seed script creates sample users, spaces, reflections, and achievements for demo/testing.
- The recommendation engine is a plain Python service/function that reads user profile and space data, scores candidate spaces, and returns ranked results with explanations.
- Frontend calls the Flask API locally, for example `http://127.0.0.1:5000/api/recommendations`.

Suggested Python package choices:

- `Flask` for the web backend.
- `Flask-CORS` only if the frontend runs on a different local port.
- `SQLAlchemy` or `Flask-SQLAlchemy` for database models.
- `Alembic` or `Flask-Migrate` if migrations are needed.
- `Werkzeug` password hashing if implementing password auth.
- `pytest` for backend tests.

SQLite guidance:

- Use SQLite for the final year project unless the user later asks for cloud hosting.
- Keep schema explicit and normalized enough to explain clearly.
- Include a repeatable seed command so demos do not depend on manual data entry.
- Do not store unnecessary precise location history.
- Keep the database file out of version control if it contains real user data.
- It is acceptable to commit a small demo seed file or seed script.

Suggested local commands, depending on final repo structure:

- Create virtual environment: `python -m venv .venv`
- Install dependencies: `pip install -r requirements.txt`
- Initialize/seed database: `python seed.py` or `flask seed`
- Run backend: `flask --app app run --debug`
- Run tests: `pytest`

## Backend Responsibilities

The backend should provide these capabilities:

- Authentication/session handling.
- User profile persistence.
- Onboarding data persistence.
- Third-space catalog storage and retrieval.
- Recommendation scoring.
- Recommendation explanation generation.
- Feedback/reflection storage.
- Progress tracking.
- Badge/points/milestone calculation.
- Admin management endpoints, if admin scope is included.

## Suggested Backend Modules

A clean backend can be organized around these domains:

- `auth`: registration, login, sessions, current user.
- `users`: profile, student metadata, preferences.
- `spaces`: third-space catalog, location, amenities, atmosphere tags.
- `recommendations`: scoring logic and ranked suggestions.
- `feedback`: post-visit reflections and ratings.
- `progress`: visit history, points, badges, milestones.
- `admin`: space management, feedback review, metrics.

Keep recommendation logic separate from route/controller code so it can be tested directly.

Possible Flask folder shape:

- `app/__init__.py` - create and configure Flask app.
- `app/models.py` - SQLAlchemy models.
- `app/routes/` - auth, users, spaces, recommendations, feedback, progress, admin routes.
- `app/services/recommendation_service.py` - scoring and explanation logic.
- `app/services/progress_service.py` - points, badges, milestones.
- `app/db.py` - database setup.
- `seed.py` - demo data.
- `tests/` - backend tests.
- `requirements.txt` - Python dependencies.

## Suggested Database Model

Minimum useful entities:

### users

Stores account-level identity.

Suggested fields:

- `id`
- `email`
- `password_hash` or external auth provider id
- `name`
- `role` such as `student` or `admin`
- `created_at`
- `updated_at`

### user_profiles

Stores personalization data.

Suggested fields:

- `id`
- `user_id`
- `home_campus` or study location
- `comfort_level`
- `preferred_social_intensity`
- `learning_goals`
- `interests`
- `accessibility_needs`
- `preferred_space_types`
- `created_at`
- `updated_at`

### spaces

Stores third-space records.

Suggested fields:

- `id`
- `name`
- `description`
- `category` such as cafe, library, lounge, event, study space
- `address`
- `latitude`
- `longitude`
- `amenities`
- `atmosphere_tags`
- `social_intensity`
- `noise_level`
- `cost_level`
- `opening_hours`
- `safety_notes`
- `cultural_notes`
- `is_active`
- `created_at`
- `updated_at`

### visits

Stores user visits or intended visits.

Suggested fields:

- `id`
- `user_id`
- `space_id`
- `visited_at`
- `verification_method` such as manual, location, or none
- `created_at`

### reflections

Stores post-visit feedback.

Suggested fields:

- `id`
- `user_id`
- `space_id`
- `visit_id`
- `comfort_rating`
- `social_rating`
- `learning_value_rating`
- `mood_before`
- `mood_after`
- `reflection_text`
- `would_return`
- `created_at`

### recommendations

Optional, but useful if recommendation history should be auditable.

Suggested fields:

- `id`
- `user_id`
- `space_id`
- `score`
- `reason`
- `input_context`
- `created_at`

### achievements

Defines available badges/milestones.

Suggested fields:

- `id`
- `code`
- `name`
- `description`
- `points`
- `criteria`

### user_achievements

Stores awarded badges/milestones.

Suggested fields:

- `id`
- `user_id`
- `achievement_id`
- `awarded_at`

## Recommendation Engine Guidance

For an MVP, use a deterministic weighted scoring algorithm rather than complex AI.

Possible scoring factors:

- Interest/tag match.
- Preferred space type match.
- Comfort level match.
- Mood match.
- Social intensity match.
- Distance from user, if location is available.
- Positive feedback from previous visits.
- Spaces not yet visited, for healthy exploration.
- Safety/accessibility/supportiveness metadata.

Every recommendation should include a human-readable reason, for example:

- "Recommended because it is quiet, nearby, and fits your low-social-energy mood today."
- "Recommended because you want to practice group interaction and this space has welcoming peer activity."
- "Recommended because your previous reflections show you prefer calm spaces with structured activities."

## API Endpoint Suggestions

If building a REST-style backend, likely endpoints include:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`
- `GET /profile`
- `PUT /profile`
- `GET /spaces`
- `GET /spaces/:id`
- `POST /recommendations`
- `GET /recommendations/history`
- `POST /visits`
- `POST /reflections`
- `GET /progress`
- `GET /achievements`
- `GET /admin/spaces`
- `POST /admin/spaces`
- `PUT /admin/spaces/:id`
- `DELETE /admin/spaces/:id` or soft-delete/deactivate

Implement these as Flask routes unless the actual repo already has a different backend structure.

## Privacy And Security Notes

This project handles sensitive student adaptation data. Treat the following as sensitive:

- mood and emotional state;
- location;
- reflection text;
- comfort level;
- social confidence/progress data;
- identity and profile data.

Implementation guidance:

- Ask for location consent explicitly.
- Do not use always-on GPS tracking.
- Store only what is needed for recommendations and progress.
- Avoid exposing one student's reflections to other students.
- Use role checks for admin endpoints.
- Hash passwords if using password auth.
- Prefer external authentication if already provided by the platform.
- Avoid logging sensitive mood/reflection/location data.

## Frontend Product Direction

The UI should feel like a practical student support tool, not a generic landing page.

Important screens:

- Welcome/login.
- Onboarding.
- Student dashboard.
- Recommendations.
- Space details.
- Reflection form.
- Progress/milestones.
- Profile/preferences.
- Admin dashboard, if in scope.

Design priorities:

- calm, clear, student-friendly interface;
- quick onboarding;
- clear recommendation explanations;
- mobile-first layout;
- easy reflection input;
- visible progress without making students feel judged;
- accessibility and readable text.

## MVP Recommendation

If continuing from scratch or from an early repo, build the MVP in this order:

1. Static screens with realistic data.
2. Typed data models.
3. Recommendation scoring function.
4. Onboarding state and recommendation updates.
5. Reflection submission flow.
6. Progress and badges from local/mock data.
7. Flask backend persistence with SQLite.
8. Authentication.
9. Admin management.
10. Location permission and nearby filtering.

## Out Of Scope Unless Requested

- Native iOS or Android apps.
- Payments.
- Complex AI/ML recommendation models.
- Continuous GPS tracking.
- Large-scale multi-campus deployment.
- Real-time chat.
- Social networking between students.

## Competitor Positioning

The project documents compare OnSite with Meetup, Bumble BFF, and VibeJe.

OnSite should be different because it is not just:

- event discovery;
- friend matching;
- generic social recommendations.

Its specific value is culturally supportive, reflective, adaptive third-space discovery for international students.

## Development Caution

Before implementing, verify the actual repo stack. The project direction is local Flask + SQLite, but the actual files still matter.

If the repo already has a Flask backend or SQLite database, extend it instead of replacing it. If there is no backend yet, create the Flask/SQLite backend locally. If there is a completely different backend already implemented, confirm before migrating.

Keep the first implementation practical: data model, recommendation scoring, reflection loop, and progress tracking matter more than a complicated algorithm.
