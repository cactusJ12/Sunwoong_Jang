# Snap Scholar Stories

A dynamic, interactive catalog website showcasing weekly stories, highlights, and skills from Snap Scholar participants. Built with vanilla HTML, CSS, and JavaScript, this project demonstrates fundamental data structures (arrays and objects) and DOM manipulation techniques.



<img width="1385" alt="Screenshot 2025-04-24 at 3 56 22 PM" src="https://github.com/user-attachments/assets/fc606632-5876-4ee3-88f6-e081568c133b" />

---

## 📖 Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Customizing Data](#customizing-data)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Demo

A live demo is available by opening `index.html` in your browser. You can explore:

- **Search** entries by scholar name, title, or highlights.
- **Filter** stories by week or skills learned.
- **Sort** entries by name or week (ascending/descending).
- **Pagination** to navigate through multiple pages of entries.
- **Add Your Story** form to submit new entries on the fly.

---

## Features

- **Data-Driven Catalog:** Uses an array of objects (`blogData.js`) to populate the UI.
- **Interactive Controls:** Search, filter, and sort controls to dynamically update the display.
- **Pagination:** Breaks large data sets into manageable pages (9 entries per page).
- **Add Entry Form:** Client-side form validation and live addition of new entries.
- **Responsive Design:** Ensures usability across desktop, tablet, and mobile devices.

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge).

### Installation

1. **Clone the repository** or download the ZIP:

   ```bash
   git clone https://github.com/your-username/snap-scholar-stories.git
   ```

2. **Navigate** into the project folder:

   ```bash
   cd snap-scholar-stories
   ```

3. **Open** `index.html` in your browser:

   ```bash
   open index.html
   ```

   Or double-click the file to launch it.

---

## Usage

1. **Browse Entries:** Scroll through the grid to view scholar stories.
2. **Search:** Use the search bar to find entries by keywords in the name, title, or highlights.
3. **Filter & Sort:** Select week, skill, or sort order from the dropdowns.
4. **Navigate Pages:** Click “Previous” or “Next” to move between pages.
5. **Add a New Story:** Fill out the form at the bottom, select a mood, color, and profile image, then click **Add Entry**.

---

## Customizing Data

- **Data Source:** Edit `blogData.js` to add, remove, or modify entries. Each entry is an object with properties:
  - `name`, `week`, `title`, `highlights`, `skillsLearned`, `shoutouts`, `emojiMood`, `quote`, `cardColor`, `profileImageSrc`.
- **Profile Images:** Place image files in the `images/` folder and reference their paths in `profileImageSrc`.
- **Styling:** Update `style.css` for custom colors, typography, or layout tweaks.
- **Behavior:** Modify `scripts.js` to add new features or adjust existing logic.

---

## Project Structure

```
├── index.html        # Main HTML template
├── style.css         # Stylesheet for layout and design
├── scripts.js        # DOM manipulation and event handling
├── blogData.js       # Sample data array of scholar stories
├── images/           # Avatar and icon assets
└── README.md         # This documentation
```

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature-name`).
5. Open a Pull Request.

Ensure your code is well-documented and you’ve tested across different browsers.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

