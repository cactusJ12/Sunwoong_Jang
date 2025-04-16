document.addEventListener('DOMContentLoaded', () => {

  // --- DOM Elements ---
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

  // --- State Variables ---
  let currentPage = 1;
  const entriesPerPage = 9;

  // --- Core Functions ---

  // Renders blog entries to the grid
  function displayEntries(entries) {
      if (!blogGrid) { console.error("blogGrid element not found!"); return; }
      blogGrid.innerHTML = ''; // Clear grid

      if (!entries || entries.length === 0) {
          blogGrid.innerHTML = '<p>No matching entries found.</p>';
          return;
      }

      entries.forEach(entry => {
          const card = document.createElement('div');
          card.classList.add('blog-card');
          card.style.backgroundColor = entry.cardColor || 'white';

          const imageSrc = entry.profileImageSrc || './images/icon-default.png'; // Default image if needed
          const imageAlt = `${entry.name || 'Scholar'}'s profile picture`;
          const shoutoutsHTML = entry.shoutouts ? `<p class="shoutouts"><strong>Shoutouts:</strong> ${entry.shoutouts}</p>` : '';
          const quoteHTML = entry.quote ? `<p class="quote">${entry.quote}</p>` : '';

          card.innerHTML = `
              <div class="card-header">
                <img src="${imageSrc}" alt="${imageAlt}" loading="lazy" onerror="this.onerror=null; this.src='./images/icon-default.png';">
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

  // Fills the filter dropdowns
  function populateFilters() {
      if (!filterWeekSelect || !filterSkillSelect) { console.warn("Filter select elements not found!"); return; }
      const currentWeekVal = filterWeekSelect.value;
      const currentSkillVal = filterSkillSelect.value;

      // Weeks
      const weeks = [...new Set(blogEntries.map(entry => entry.week).filter(Boolean))].sort((a, b) => a - b);
      filterWeekSelect.innerHTML = '<option value="all">All Weeks</option>';
      weeks.forEach(week => {
          const option = document.createElement('option');
          option.value = week;
          option.textContent = `${week}`;
          option.selected = (String(week) === currentWeekVal);
          filterWeekSelect.appendChild(option);
      });
      if (!filterWeekSelect.querySelector(`option[value="${currentWeekVal}"]`)) { filterWeekSelect.value = 'all'; }

      // Skills
      const skills = [...new Set(blogEntries.flatMap(entry => entry.skillsLearned || []))].filter(skill => skill).sort();
      filterSkillSelect.innerHTML = '<option value="all">All Skills</option>';
      skills.forEach(skill => {
          const option = document.createElement('option');
          option.value = skill;
          option.textContent = skill;
          option.selected = (skill === currentSkillVal);
          filterSkillSelect.appendChild(option);
      });
      if (!filterSkillSelect.querySelector(`option[value="${currentSkillVal}"]`)) { filterSkillSelect.value = 'all'; }
  }

  // Filters and sorts the main blogEntries array
  function getProcessedEntries() {
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
      const selectedWeek = filterWeekSelect ? filterWeekSelect.value : 'all';
      const selectedSkill = filterSkillSelect ? filterSkillSelect.value : 'all';
      const sortBy = sortBySelect ? sortBySelect.value : 'default';

      const filteredEntries = blogEntries.filter(entry => {
          const nameMatch = entry.name?.toLowerCase().includes(searchTerm); // Optional chaining
          const titleMatch = entry.title?.toLowerCase().includes(searchTerm);
          const highlightsMatch = entry.highlights?.toLowerCase().includes(searchTerm);
          const matchesSearch = !searchTerm || nameMatch || titleMatch || highlightsMatch;
          const matchesWeek = selectedWeek === 'all' || (entry.week === parseInt(selectedWeek));
          const matchesSkill = selectedSkill === 'all' || entry.skillsLearned?.includes(selectedSkill); // Optional chaining
          return matchesSearch && matchesWeek && matchesSkill;
      });

      const sortedEntries = [...filteredEntries];
      switch (sortBy) {
          case 'name-asc': sortedEntries.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
          case 'name-desc': sortedEntries.sort((a, b) => (b.name || '').localeCompare(a.name || '')); break;
          case 'week-asc': sortedEntries.sort((a, b) => (a.week || 0) - (b.week || 0)); break;
          case 'week-desc': sortedEntries.sort((a, b) => (b.week || 0) - (a.week || 0)); break;
          default: sortedEntries.sort((a, b) => (a.week || 0) - (b.week || 0)); break; // Default sort
      }
      return sortedEntries;
  }

  // --- Pagination Functions ---

  // Displays the correct slice of entries for the current page
  function displayEntriesWithPagination(entries) {
      const startIndex = (currentPage - 1) * entriesPerPage;
      const paginatedEntries = entries.slice(startIndex, startIndex + entriesPerPage);
      displayEntries(paginatedEntries);
      updatePaginationControls(entries.length);
  }

  // Updates the Previous/Next buttons and page info text
  function updatePaginationControls(totalFilteredEntries) {
      const totalPages = Math.ceil(totalFilteredEntries / entriesPerPage);
      if (pageInfoSpan) { pageInfoSpan.textContent = totalPages > 0 ? `Page ${currentPage} of ${totalPages}` : 'Page 0 of 0'; }
      if (prevButton) { prevButton.disabled = (currentPage <= 1); }
      if (nextButton) { nextButton.disabled = (currentPage >= totalPages); }
      if (paginationControlsDiv) { paginationControlsDiv.style.display = totalPages > 1 ? 'flex' : 'none'; }
  }

  // Helper to update the display after changes
  function updateDisplayAndPagination() {
      const processedEntries = getProcessedEntries();
      displayEntriesWithPagination(processedEntries);
  }

  // --- Form Handling ---

  // Shows a message (success/error) below the form
  function showFormMessage(message, type = 'error') {
      if (!formMessage) return;
      formMessage.textContent = message;
      formMessage.className = `form-message ${type}`;
      formMessage.style.display = 'block';
  }

  // Hides the form message
  function hideFormMessage() {
      if (!formMessage) return;
      formMessage.textContent = '';
      formMessage.className = 'form-message';
      formMessage.style.display = 'none';
  }

  // Handles the form submission
  function handleAddEntry(event) {
      event.preventDefault();
      hideFormMessage();

      const formData = new FormData(addEntryForm);

      // Extract data
      const name = formData.get('scholarName')?.trim() || '';
      const weekStr = formData.get('weekNumber')?.trim();
      const title = formData.get('blogTitle')?.trim() || '';
      const highlights = formData.get('highlights')?.trim() || '';
      const skillsRaw = formData.get('skillsLearned')?.trim() || '';
      const shoutouts = formData.get('shoutouts')?.trim() || '';
      const quote = formData.get('quote')?.trim() || '';
      const emojiMood = addEntryForm.querySelector('input[name="emojiMood"]:checked')?.value || null;
      const cardColor = addEntryForm.querySelector('input[name="cardColor"]:checked')?.value || null;
      const profileImageSrc = addEntryForm.querySelector('input[name="profileImage"]:checked')?.value || null;

      // Validate data
      const errors = [];
      if (!name) errors.push("Scholar Name");
      const week = parseInt(weekStr);
      if (isNaN(week) || week < 1) errors.push("Valid Week Number (>= 1)");
      if (!title) errors.push("Blog Title");
      if (!highlights) errors.push("Highlights");
      if (!skillsRaw) errors.push("Skills Learned");
      if (!emojiMood) errors.push("Emoji Mood");
      if (!cardColor) errors.push("Card Color");
      if (!profileImageSrc) errors.push("Profile Picture");

      const skillsLearned = skillsRaw.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
      if (skillsLearned.length === 0 && skillsRaw) { errors.push("At least one valid Skill"); }

      if (errors.length > 0) {
          showFormMessage(`Please fill out: ${errors.join(', ')}.`, "error");
          return;
      }

      // Create and add the new entry
      const newEntry = { name, week, title, highlights, skillsLearned, shoutouts, emojiMood, quote, cardColor, profileImageSrc };
      blogEntries.push(newEntry);

      // Update UI and give feedback
      addEntryForm.reset();
      showFormMessage("Blog entry added successfully!", "success");
      populateFilters(); // Update filters in case of new week/skill
      currentPage = 1;   // Go back to first page
      updateDisplayAndPagination();
      setTimeout(hideFormMessage, 4000); // Hide success message after a delay
  }

  // --- Event Listeners ---

  // Filter/Sort/Search listeners
  if (searchInput) { searchInput.addEventListener('input', () => { currentPage = 1; updateDisplayAndPagination(); }); }
  else { console.warn("Search input not found."); }
  if (filterWeekSelect) { filterWeekSelect.addEventListener('change', () => { currentPage = 1; updateDisplayAndPagination(); }); }
  else { console.warn("Filter week select not found."); }
  if (filterSkillSelect) { filterSkillSelect.addEventListener('change', () => { currentPage = 1; updateDisplayAndPagination(); }); }
  else { console.warn("Filter skill select not found."); }
  if (sortBySelect) { sortBySelect.addEventListener('change', () => { currentPage = 1; updateDisplayAndPagination(); }); }
  else { console.warn("Sort by select not found."); }

  // Form submission listener
  if (addEntryForm) { addEntryForm.addEventListener('submit', handleAddEntry); }
  else { console.error("Add entry form not found."); }

  // Pagination listeners
  if (prevButton) {
      prevButton.addEventListener('click', () => {
          if (currentPage > 1) { currentPage--; updateDisplayAndPagination(); }
      });
  } else { console.warn("Previous page button not found."); }
  if (nextButton) {
      nextButton.addEventListener('click', () => {
          const totalEntries = getProcessedEntries().length;
          const totalPages = Math.ceil(totalEntries / entriesPerPage);
          if (currentPage < totalPages) { currentPage++; updateDisplayAndPagination(); }
      });
  } else { console.warn("Next page button not found."); }

  // --- Initial Setup ---
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

}); // End DOMContentLoaded