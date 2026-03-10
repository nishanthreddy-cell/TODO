# ✅ Sleek Todo — Organize Your Day

> A modern, premium client-side Todo application with an **Architect's Blueprint** visual design. Built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## 🎯 Project Objective

To build a **clean, functional, and visually stunning** task management application that runs entirely in the browser. The app enables users to create, organize, complete, and delete tasks with category tagging and due-date tracking — all while persisting data locally so nothing is ever lost between sessions.

---

## 📖 Project Description

**Sleek Todo** is a single-page productivity tool designed with a distinctive "Architect's Blueprint" dark theme inspired by technical drafting aesthetics. It offers a focused, distraction-free interface for managing daily tasks.

### Key Features

| Feature | Description |
|---|---|
| **Add Tasks** | Quickly create tasks with a text input and inline add button |
| **Task Categories** | Assign categories — *General, Work, Personal, Study, Shopping* — displayed as color-coded pills |
| **Due Dates** | Set optional due dates with smart formatting (*Today*, *Tomorrow*, *Mar 15*) and overdue highlighting |
| **Toggle Completion** | Mark tasks as done with a smooth strikethrough animation |
| **Delete Tasks** | Remove tasks with a hover-reveal delete button |
| **Filter Tasks** | View *All*, *Active*, or *Completed* tasks with tab-style filters |
| **Clear Completed** | Bulk-remove all finished tasks in one click |
| **Dark / Light Theme** | Toggle between a Blueprint-blue dark mode and a clean light mode |
| **Persistent Storage** | All tasks and theme preference are saved to `localStorage` |
| **Responsive Design** | Fully responsive — optimized for desktop and mobile screens |
| **XSS Protection** | All user input is HTML-escaped before rendering |

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure and accessibility (`aria-*` attributes) |
| **CSS3** | Custom properties (CSS variables), transitions, responsive layout, theming |
| **Vanilla JavaScript (ES6+)** | DOM manipulation, event handling, `localStorage` persistence, `crypto.randomUUID()` |
| **Google Fonts** | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — a modern monospace-inspired typeface |
| **SVG Icons** | Inline SVG for the logo, add button, calendar icon, and empty-state illustration |

> **No external libraries or frameworks** — the entire application is built from scratch.

---

## 🚀 Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server, build tool, or package manager required

### Steps to Run

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TODO
   ```

2. **Open the app**
   - Simply double-click `index.html`, **or**
   - Use a local development server:
     ```bash
     # Using Python
     python3 -m http.server 8000

     # Using Node.js (npx)
     npx serve .
     ```
   - Then navigate to `http://localhost:8000` in your browser.

3. **Start adding tasks!**
   - Select a category from the dropdown
   - Optionally pick a due date
   - Type your task and press **Enter** or click the **+** button

---

## 📸 Screenshots

### Dark Mode (Architect's Blueprint Theme)

<img width="673" height="910" alt="image" src="https://github.com/user-attachments/assets/a3af1c55-b4c8-40ac-a770-df288b77fd19" />


### Light Mode

<img width="669" height="900" alt="image" src="https://github.com/user-attachments/assets/630b5fa3-7cfc-4dcb-b0cb-7c91545a8229" />

### All Tasks

<img width="676" height="909" alt="image" src="https://github.com/user-attachments/assets/f262c994-1e7c-49e0-acf2-61754b8c59f2" />

### Active Tasks

<img width="668" height="908" alt="image" src="https://github.com/user-attachments/assets/49f8b88e-8039-440b-87aa-ed3f7ed16e45" />

### Completed Tasks

<img width="675" height="908" alt="image" src="https://github.com/user-attachments/assets/13d4af19-d065-4f0a-aaed-5e462c0769aa" />

---

## ⚡ Challenges Faced

1. **Theme Persistence Across Sessions**
   Ensuring the selected theme (dark/light) persists correctly on reload required careful ordering of `localStorage` reads during initialization — the theme must be applied *before* the first paint to avoid a flash of the wrong theme.

2. **Unique ID Generation**
   When loading tasks from `localStorage`, duplicate or missing IDs could cause toggle/delete bugs. This was solved by validating and deduplicating IDs on load, falling back to `crypto.randomUUID()` or a timestamp-based fallback for older browsers.

3. **Date Handling Edge Cases**
   Comparing due dates against "today" is surprisingly tricky due to timezone offsets. Creating dates with an explicit `T00:00:00` suffix and normalizing both dates' hours to midnight ensured consistent overdue detection.

4. **Mobile UX Considerations**
   iOS Safari auto-zooms on input focus when the font size is below 16px. The responsive styles explicitly set `font-size: 16px` on inputs to prevent this. The delete button is also always visible on mobile (no hover state) for better touch accessibility.

5. **XSS Prevention**
   Since task text is injected via `innerHTML`, all user input is passed through an `escapeHtml()` function to neutralize any embedded HTML/script tags.

---

## 📂 Project Structure

```
TODO/
├── index.html        # Main HTML page
├── styles.css        # All styles (dark/light themes, responsive)
├── app.js            # Application logic (CRUD, filtering, persistence)
├── screenshots/      # Project screenshots
│   ├── dark-mode.png
│   └── light-mode.png
└── README.md         # This file
```

---

## 📄 License

This project is open-source and available for educational and personal use.
