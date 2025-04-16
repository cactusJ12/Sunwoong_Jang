// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
      

  const blogGrid = document.getElementById('blog-grid');
  const searchInput = document.getElementById('search-input');
  const filterWeekSelect = document.getElementById('filter-week');
  const filterSkillSelect = document.getElementById('filter-skill');
  const sortBySelect = document.getElementById('sort-by');
  const addEntryForm = document.getElementById('add-entry-form');
  const formMessage = document.getElementById('form-message');
  const prevButton = document.getElementById('prevPage');
  const nextButton = document.getElementById('nextPage');
  const pageInfoSpan = document.getElementById('pageInfo');
  const paginationControlsDiv = document.getElementById('pagination-controls');

  // ==================================================
  // Page State
  // ==================================================
  let currentPage = 1;
  const entriesPerPage = 9; // Display 9 cards per page (3x3 grid)

  // ==================================================
  // Functions
  // ==================================================

  /**
   * Renders an array of blog entries to the grid.
   * @param {Array<Object>} entries - The array of blog entry objects to display.
   */
  function displayEntries(entries) {
      if (!blogGrid) {
          console.error("displayEntries: blogGrid element not found!");
          return;
      }
      blogGrid.innerHTML = ''; // Clear previous entries

      if (!entries || entries.length === 0) {
          blogGrid.innerHTML = '<p>No matching entries found.</p>';
          return;
      }

      entries.forEach(entry => {
          const card = document.createElement('div');
          card.classList.add('blog-card');
          card.style.backgroundColor = entry.cardColor || 'white'; // Apply card color

          const imageSrc = entry.profileImageSrc ; // Use stored path or fallback
          const imageAlt = `${entry.name || 'Scholar'}'s profile picture`;
          const shoutoutsHTML = entry.shoutouts ? `<p class="shoutouts"><strong>Shoutouts:</strong> ${entry.shoutouts}</p>` : '';
          const quoteHTML = entry.quote ? `<p class="quote">${entry.quote}</p>` : '';

          card.innerHTML = `
              <div class="card-header">
                <img src="${imageSrc}" alt="${imageAlt}" loading="lazy"
                  onerror="this.onerror=null;">
                <div class="card-header-info">
                  <h3>${entry.name || 'Unnamed Scholar'}</h3>
                  <p class="week-info">Week ${entry.week || 'N/A'}</p>
                </div>
                <span class="mood-emoji" title="Mood: ${entry.emojiMood || '?'}">${entry.emojiMood || '😶'}</span>
              </div>
              <h4>${entry.title || 'Untitled Entry'}</h4>
              <p class="highlights">${entry.highlights || ''}</p>
              ${shoutoutsHTML}
              ${quoteHTML}
          `;
          blogGrid.appendChild(card);
      });
  }

  /**
   * Populates the filter dropdowns (Week, Skill) based on available data.
   */
  function populateFilters() {
      if (!filterWeekSelect || !filterSkillSelect) {
          console.warn("populateFilters: Filter select elements not found!");
          return;
      }
      // Store current values before clearing
      const currentWeekVal = filterWeekSelect.value;
      const currentSkillVal = filterSkillSelect.value;

      // Weeks
      const weeks = [...new Set(blogEntries.map(entry => entry.week).filter(Boolean))].sort((a, b) => a - b); // Filter out undefined/null weeks
      filterWeekSelect.innerHTML = '<option value="all">All Weeks</option>'; // Reset
      weeks.forEach(week => {
          const option = document.createElement('option');
          option.value = week;
          option.textContent = `${week}`; // Use just the number for text
          option.selected = (String(week) === currentWeekVal); // Restore selection
          filterWeekSelect.appendChild(option);
      });
      // If previously selected value no longer exists, default to 'all'
      if (!filterWeekSelect.querySelector(`option[value="${currentWeekVal}"]`)) {
         filterWeekSelect.value = 'all';
      }

      // Skills
      const skills = [...new Set(blogEntries.flatMap(entry => entry.skillsLearned || []))]
                      .filter(skill => skill) // Ensure no empty skills
                      .sort();
      filterSkillSelect.innerHTML = '<option value="all">All Skills</option>'; // Reset
      skills.forEach(skill => {
          const option = document.createElement('option');
          option.value = skill;
          option.textContent = skill;
          option.selected = (skill === currentSkillVal); // Restore selection
          filterSkillSelect.appendChild(option);
      });
      // If previously selected value no longer exists, default to 'all'
      if (!filterSkillSelect.querySelector(`option[value="${currentSkillVal}"]`)) {
          filterSkillSelect.value = 'all';
      }
  }

  /**
   * Filters and sorts the global blogEntries array based on current control values.
   * @returns {Array<Object>} The filtered and sorted array of blog entries.
   */
  function getProcessedEntries() {
      // Safe access to control values with fallbacks
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
      const selectedWeek = filterWeekSelect ? filterWeekSelect.value : 'all';
      const selectedSkill = filterSkillSelect ? filterSkillSelect.value : 'all';
      const sortBy = sortBySelect ? sortBySelect.value : 'default';

      // 1. Filter
      const filteredEntries = blogEntries.filter(entry => {
          // Search logic (checks name, title, highlights)
          const nameMatch = entry.name && entry.name.toLowerCase().includes(searchTerm);
          const titleMatch = entry.title && entry.title.toLowerCase().includes(searchTerm);
          const highlightsMatch = entry.highlights && entry.highlights.toLowerCase().includes(searchTerm);
          const matchesSearch = !searchTerm || nameMatch || titleMatch || highlightsMatch; // True if search is empty or any field matches

          // Filter logic
          const matchesWeek = selectedWeek === 'all' || (entry.week && entry.week === parseInt(selectedWeek));
          const matchesSkill = selectedSkill === 'all' || (entry.skillsLearned && entry.skillsLearned.includes(selectedSkill));

          return matchesSearch && matchesWeek && matchesSkill;
      });

      // 2. Sort (Create a copy to avoid modifying the filtered array in place)
      const sortedEntries = [...filteredEntries];
      switch (sortBy) {
          case 'name-asc':
              sortedEntries.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
              break;
          case 'name-desc':
              sortedEntries.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
              break;
          case 'week-asc':
              sortedEntries.sort((a, b) => (a.week || 0) - (b.week || 0));
              break;
          case 'week-desc':
              sortedEntries.sort((a, b) => (b.week || 0) - (a.week || 0));
              break;
          // case 'default': // Default is week-asc, handled by default case
          default:
               sortedEntries.sort((a, b) => (a.week || 0) - (b.week || 0));
               break;
      }
      return sortedEntries;
  }

  /**
   * Displays a subset of entries based on the current page.
   * @param {Array<Object>} entries - The FULL array of entries (already filtered/sorted).
   */
  function displayEntriesWithPagination(entries) {
      const startIndex = (currentPage - 1) * entriesPerPage;
      const paginatedEntries = entries.slice(startIndex, startIndex + entriesPerPage);
      displayEntries(paginatedEntries); // Render only the subset
      updatePaginationControls(entries.length); // Update UI based on TOTAL count
  }

  /**
   * Updates the pagination controls (buttons, page info text).
   * @param {number} totalFilteredEntries - The total number of entries AFTER filtering.
   */
  function updatePaginationControls(totalFilteredEntries) {
      const totalPages = Math.ceil(totalFilteredEntries / entriesPerPage);

      // Update text (only if span exists)
      if (pageInfoSpan) {
          pageInfoSpan.textContent = totalPages > 0 ? `Page ${currentPage} of ${totalPages}` : 'Page 0 of 0';
      }

      // Enable/disable buttons (only if they exist)
      if (prevButton) {
          prevButton.disabled = (currentPage <= 1);
      }
      if (nextButton) {
          nextButton.disabled = (currentPage >= totalPages);
      }

      // Show/hide the entire pagination control section
      if (paginationControlsDiv) {
          // Use 'flex' to match the CSS display property for centering
          paginationControlsDiv.style.display = totalPages > 1 ? 'flex' : 'none';
      }
  }

  /**
   * Updates the grid display by processing entries and applying pagination.
   * Should be called whenever filters, sort order, or search term changes.
   */
  function updateDisplayAndPagination() {
      const processedEntries = getProcessedEntries();
      displayEntriesWithPagination(processedEntries);
  }

  /**
   * Shows a status message below the form.
   * @param {string} message - The message text to display.
   * @param {'success' | 'error'} type - The type of message ('success' or 'error').
   */
  function showFormMessage(message, type = 'error') {
      if (!formMessage) return;
      formMessage.textContent = message;
      formMessage.className = `form-message ${type}`; // Add class for styling
      formMessage.style.display = 'block'; // Make it visible
  }

  /**
   * Hides the status message area below the form.
   */
  function hideFormMessage() {
       if (!formMessage) return;
      formMessage.textContent = '';
      formMessage.className = 'form-message'; // Reset classes
      formMessage.style.display = 'none'; // Hide it
  }

  /**
   * Handles the submission of the new blog entry form.
   * Validates input, creates a new entry object, adds it to the data,
   * and updates the display.
   * @param {Event} event - The form submission event.
   */
  function handleAddEntry(event) {
      event.preventDefault(); // Prevent page reload
      hideFormMessage(); // Clear previous messages

      const formData = new FormData(addEntryForm);

      // --- Extract and Trim form data ---
      const name = formData.get('scholarName')?.trim() || '';
      const weekStr = formData.get('weekNumber')?.trim();
      const title = formData.get('blogTitle')?.trim() || '';
      const highlights = formData.get('highlights')?.trim() || '';
      const skillsRaw = formData.get('skillsLearned')?.trim() || '';
      const shoutouts = formData.get('shoutouts')?.trim() || '';
      const quote = formData.get('quote')?.trim() || ''; // Corrected name attribute needed in HTML
      const selectedMoodElement = addEntryForm.querySelector('input[name="emojiMood"]:checked');
      const emojiMood = selectedMoodElement ? selectedMoodElement.value : null;
      const selectedColorElement = addEntryForm.querySelector('input[name="cardColor"]:checked');
      const cardColor = selectedColorElement ? selectedColorElement.value : null;
      const selectedImageElement = addEntryForm.querySelector('input[name="profileImage"]:checked');
      const profileImageSrc = selectedImageElement ? selectedImageElement.value : null;

      // --- Basic Validation ---
      const errors = [];
      if (!name) errors.push("Scholar Name");
      const week = parseInt(weekStr); // Parse AFTER checking if string exists
      if (isNaN(week) || week < 1) errors.push("Valid Week Number (>= 1)");
      if (!title) errors.push("Blog Title");
      if (!highlights) errors.push("Highlights");
      if (!skillsRaw) errors.push("Skills Learned");
      if (!emojiMood) errors.push("Emoji Mood selection");
      if (!cardColor) errors.push("Card Color selection");
      if (!profileImageSrc) errors.push("Profile Picture selection");

      // Process skills string into an array AFTER checking raw input
      const skillsLearned = skillsRaw.split(',')
                                   .map(skill => skill.trim())
                                   .filter(skill => skill !== ''); // Remove empty strings

      if (skillsLearned.length === 0 && skillsRaw) { // Only error if raw input existed but yielded no skills
           errors.push("At least one valid Skill (comma-separated)");
      }

      // If validation fails, show errors and stop
      if (errors.length > 0) {
          showFormMessage(`Please fill out the following required fields: ${errors.join(', ')}.`, "error");
          return;
      }

      // --- Create new entry object ---
      const newEntry = {
          name,
          week,
          title,
          highlights,
          skillsLearned,
          shoutouts,
          emojiMood,
          quote,
          cardColor,
          profileImageSrc
      };

      // --- Add entry, update UI, show success ---
      blogEntries.push(newEntry); // Add to the main data array
      addEntryForm.reset();      // Clear the form
      showFormMessage("Blog entry added successfully!", "success");

      populateFilters();         // Repopulate filters (might have new week/skill)
      currentPage = 1;           // Reset to page 1 after adding
      updateDisplayAndPagination(); // Refresh the grid

      // Optional: Hide success message after a delay
      setTimeout(hideFormMessage, 4000);
  }


  // ==================================================
  // Event Listeners Setup
  // ==================================================

  // Check if elements exist before adding listeners
  if (searchInput) {
      searchInput.addEventListener('input', () => {
          currentPage = 1; // Reset page on search
          updateDisplayAndPagination();
      });
  } else { console.warn("Search input element not found."); }

  if (filterWeekSelect) {
      filterWeekSelect.addEventListener('change', () => {
          currentPage = 1; // Reset page on filter change
          updateDisplayAndPagination();
      });
  } else { console.warn("Filter week select element not found."); }

  if (filterSkillSelect) {
      filterSkillSelect.addEventListener('change', () => {
          currentPage = 1; // Reset page on filter change
          updateDisplayAndPagination();
      });
  } else { console.warn("Filter skill select element not found."); }

  if (sortBySelect) {
      sortBySelect.addEventListener('change', () => {
          currentPage = 1; // Reset page on sort change
          updateDisplayAndPagination();
      });
  } else { console.warn("Sort by select element not found."); }

  if (addEntryForm) {
      addEntryForm.addEventListener('submit', handleAddEntry);
  } else { console.error("Add entry form element not found. Form submission will not work."); }

  if (prevButton) {
      prevButton.addEventListener('click', () => {
          if (currentPage > 1) {
              currentPage--;
              updateDisplayAndPagination(); // Update display for new page
          }
      });
  } else { console.warn("Previous page button not found."); }

  if (nextButton) {
      nextButton.addEventListener('click', () => {
          // Recalculate total pages based on potentially filtered entries
          const totalEntries = getProcessedEntries().length;
          const totalPages = Math.ceil(totalEntries / entriesPerPage);
          if (currentPage < totalPages) {
              currentPage++;
              updateDisplayAndPagination(); // Update display for new page
          }
      });
  } else { console.warn("Next page button not found."); }


  // ==================================================
  // Initialization on Page Load
  // ==================================================
  if (blogGrid) {
      populateFilters();         
      
      console.log(blogEntries);  
      updateDisplayAndPagination();  // Then display initial entries with pagination
  } else {
      console.error("Blog grid element not found. Initial display skipped.");
      // Hide pagination if grid isn't found
      if (paginationControlsDiv) {
          paginationControlsDiv.style.display = 'none';
      }
  }

}); // End DOMContentLoaded wrapper