# AI Code Assist Project Instructions

## 1. Technology Stack & Code Style

### Core Technologies
- **Framework:** Expo (Managed Workflow) ~54.0.
- **Runtime:** React Native 0.81.
- **Language:** TypeScript ~5.9 (Strict mode).
- **Routing:** `expo-router` (File-based routing).
- **UI Library:** React Native Reanimated 4, Gesture Handler 2.28, Expo Vector Icons, React Native SVG 15.12.
- **Native APIs:** Expo Audio 1.1, Expo Haptics 15.0, Expo Contacts 15.0.

### Code Style
- **Functional Components:** Use React Functional Components with Hooks.
- **Typing:** Explicitly type props and return values. Avoid `any`.
- **Linting:** Ensure code passes `npm run lint` (eslint-config-expo).
- **Imports:** Use absolute imports where configured, otherwise keep relative paths clean.

## 2. Testing Guidelines

- **Focus:** Prioritize "Happy Paths" (core functionality) and critical "Edge Cases" (error handling, empty states).
- **Coverage:** Do not aim for 100% arbitrary coverage. Aim for high confidence in business logic and UI stability.
- **Tools:** Use React Native Testing Library (RNTL).

## 3. Domain Terminology (Stargate Theme)

This project utilizes a Stargate SG-1 thematic naming convention.

## 4. Workflow Instructions

- **Step-by-Step:** Do not generate the entire solution at once. Break complex tasks into small, logical steps and ask for confirmation before proceeding.
- **Atomic Changes:** Keep file edits focused on specific features to avoid regression.

## 5. Documentation Maintenance

Whenever code is modified, verify if `README.md` requires updates. Specifically:
- **Usage:** If new features are added, explain how to use them.
- **Running:** Ensure instructions for `npm start`, `npm run android`, etc., are accurate.
- **Testing:** Document how to run the new tests.
- **Logs:** Document how to view logs.
