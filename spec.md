# IntelliHub Vista

## Current State
New project, no existing frontend or backend code.

## Requested Changes (Diff)

### Add
- User registration and login (email + password via authorization component)
- Landing/auth page with logo, tagline, register/login forms
- Dashboard page (accessible only after login) with 7 AI tool cards in a responsive grid
- About modal that opens when user clicks the logo, showing IntelliHub Vista description
- Each tool card links to its external URL (opens in new tab)
- Logo image: /assets/uploads/Hexagonal-Neural-Hub-Icon-with-Vibrant-Colors_20260307_184744_0000-1.png

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend
- Use authorization component for user registration, login, session management
- Store basic user profile (username, email)

### Frontend
- Auth page: centered card with logo, tagline, toggle between Login and Register forms
- Dashboard (protected route): top navbar with logo (clickable for about modal) and logout button
- 7 tool cards in a responsive 3-column grid:
  1. Smart Study AI -- https://smartstudy-ai-cup.caffeine.xyz -- study planning
  2. AI Career Guidance -- https://ai-career-guidance-platform-zw8.caffeine.xyz -- career advice
  3. Mentor AI -- https://react-9b5mk3.onspace.build -- mentorship
  4. Instant Knowledge -- https://react-9b5yj2.onspace.build -- knowledge queries
  5. AI Personal Chef -- https://ai-personal-chef-tea.caffeine.xyz -- recipe/food
  6. Medical Diagnosis -- https://react-9b5yio.onspace.build -- health/diagnosis
  7. Creative AI Studio -- https://creative-ai-studio-zy9.caffeine.xyz -- creative tools
- About modal with full platform description
- Dark futuristic theme matching logo's pink-to-orange gradient palette
