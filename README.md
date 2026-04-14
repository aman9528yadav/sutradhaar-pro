# Sutradhaar - Smart Unit Converter & Calculator

Sutradhaar is a modern, feature-rich web application that provides a seamless experience for unit conversions and calculations. Built with Next.js, TypeScript, and Tailwind CSS, it offers a clean, responsive, and user-friendly interface. The app includes a dashboard to track activity, a powerful unit converter with a wide range of categories, a scientific calculator, and persistent history tracking.

## ✨ Features

- **📊 Interactive Dashboard:** A central hub to view your usage statistics, including all-time conversions, today's conversions, and your activity streak.
- **⚡ Customizable Quick Access:** Easily navigate to the app's main features. You can reorder and hide items to personalize your dashboard.
- **📝 Todo List:** A full-featured todo manager to keep track of your tasks. Add tasks with priorities, target dates, and recurring schedules.
- **🔄 Smart Unit Converter:**
  - Convert between a wide variety of units across categories like Length, Weight, Temperature, Area, and more.
  - Support for both International and local Indian units.
  - Swap "From" and "To" units with a single click.
  - View conversion comparisons across all units in a category.
- **🧮 Scientific Calculator:** A powerful calculator that supports basic arithmetic, scientific functions (sin, cos, tan, log), and keeps a record of your recent calculations.
- **📜 Persistent History:** Your conversion and calculation history is automatically saved to your browser's local storage, so you never lose track of your work.
- **📓 Notes:** A simple and elegant notes feature to jot down your thoughts and ideas with a rich text editor.
- **👤 User Profile:** A dedicated profile page to view your stats, achievements, and manage personal information.
- **🎨 Modern & Responsive UI:** Built with ShadCN UI and Tailwind CSS for a beautiful, consistent, and responsive experience on any device.
- **🔐 Authentication:** Secure login and sign-up functionality using Firebase Authentication, including Google sign-in.
- **⏲️ Productivity Tools:** Includes a versatile Date Calculator, a visual Timer, and a precise Stopwatch with lap functionality.
- **🔧 Developer Panel:** A hidden developer panel for maintenance mode control, content management, and debugging.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
- **AI/Generative:** [Genkit](https://firebase.google.com/docs/genkit)
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **State Management:** React Context API

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Firebase project with Authentication enabled.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_REPOSITORY_URL>
    cd <YOUR_PROJECT_DIRECTORY>
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```
    
3.  **Set up Firebase:**
    - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    - Enable the sign-in providers you want to use (e.g., Google, Email/Password).
    - Get your Firebase project configuration and replace the placeholder values in `src/lib/firebase.ts`.

4.  **Run the development server:**
    ```sh
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📂 Project Structure

The project follows a standard Next.js App Router structure:

-   `src/app/`: Contains all the pages and routes for the application.
-   `src/components/`: Contains all the reusable React components, including UI components from ShadCN.
-   `src/context/`: Contains React context providers for managing global state (e.g., `ProfileContext`, `AuthContext`).
-   `src/lib/`: Contains utility functions, constants, and library configurations (e.g., `units.ts`, `firebase.ts`).
-   `src/ai/`: Contains AI-related logic, including Genkit flows.
-   `public/`: Contains static assets like images and fonts.

## ✍️ Author

-   **Aman Yadav** - *Developer*
