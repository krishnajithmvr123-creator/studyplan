# StudyFlow - Mobile Syllabus & Study Progress Tracker

A mobile-first web application designed specifically for smartphones and mobile browsers, built with **HTML5, Tailwind CSS, Vanilla JavaScript, and Supabase / PostgreSQL**.

---

## 📱 Mobile-First App Design

- **Native App Feel**: Tailored for thumb-friendly one-handed navigation with bottom navigation tabs and touch feedback.
- **Docked Mobile Bottom Bar**:
  - 📚 **Syllabus**: Module-wise topics, 4-stage status cycler, spaced repetition (`R1`, `R2`, `R3`), confidence stars, and search filters.
  - ⏱️ **Timer**: Dedicated mobile Focus Pomodoro with animated circular countdown ring and topic-linking.
  - 📊 **Stats**: Clean mobile analytics (exam countdown, modules completed, revision stages, study hours logged).
  - 👤 **Account**: Student profile, cloud sync status, Supabase cloud configuration, dark mode, and JSON backups.
- **Mobile Bottom Sheets**: Modals slide up smoothly from the bottom of the screen (Quick Actions, Add Topic, Add Module, Notes, and Syllabus Importer).
- **Desktop Smartphone Frame**: When viewed on desktop/laptop browsers, it automatically centers inside a sleek mobile phone frame. On actual phones, it expands to 100% full screen width with safe-area insets.

---

## 🚀 How to Run Locally

Open **`index.html`** in your browser:
```powershell
Start-Process "C:\Users\DELL\.gemini\antigravity\scratch\study-syllabus-tracker\index.html"
```
*(Tip: In Chrome/Edge on your PC, press `F12` and click the **Device Toolbar icon (Ctrl+Shift+M)** to simulate iPhone or Android screen sizes!)*

---

## ☁️ Cloud Data Storage (Supabase)

1. Open the app &rarr; tap the **Account** tab in the bottom bar.
2. Tap **Configure** under *Supabase Cloud Database*.
3. Paste your **Project URL** and **Anon Key** &rarr; tap **Save Credentials**.
4. Tap **Sign In / Sign Up** to create your student account. All your progress will now sync to the cloud!

---

## 📂 Project Structure

```
study-syllabus-tracker/
├── index.html           # Mobile-only single-page layout & bottom sheets
├── app.js               # Mobile tab router, timer engine, and Supabase sync
├── styles.css           # Mobile viewport frame, touch-press effects, and bottom sheets
├── supabase-schema.sql  # Database schema with Row Level Security (RLS)
└── README.md            # Mobile app documentation
```
