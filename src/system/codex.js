// src/system/codex.js

// Function to display the codex
window.displayCodex = function() {
    const codex = State.variables.codex;
    let html = '<div class="codex-container">';
    html += '<h1>速写本</h1>';
    html += '<div class="codex-grid">';

    if (!codex || Object.keys(codex).length === 0) {
        html += '<p>目前还没有任何发现。</p>';
    } else {
        for (const entryId in codex) {
            if (codex.hasOwnProperty(entryId)) {
                const entry = codex[entryId];
                html += `<div class="codex-entry ${entry.discovered ? '' : 'locked'} ${entry.drawn ? 'drawn' : ''}">`;
                if (!entry.discovered) {
                    html += `<h2>?</h2>`;
                } else {
                    html += `<h2>${entry.title}</h2>`;
                }

                if (entry.discovered) {
                    html += `<p class="preview-desc">${entry.previewDesc}</p>`;
                    if (entry.drawn) {
                        // Make sure .codex-image class is on the img tag
                        html += `<div class="codex-image-container"><img src="${entry.imagePath}" alt="${entry.title}" class="codex-image"></div>`;
                        html += `<p class="full-desc">${entry.fullDesc || (entry.fullDesc_accepted && State.variables.playerChoice === 'accepted' ? entry.fullDesc_accepted : entry.fullDesc_refused || '')}</p>`;
                        html += `<p class="dominique-comment">多米尼克：${entry.dominiqueComment || (entry.dominiqueComment_accepted && State.variables.playerChoice === 'accepted' ? entry.dominiqueComment_accepted : entry.dominiqueComment_refused || '')}</p>`;
                        html += '<p class="status-drawn">已描绘</p>';
                    } else {
                        html += `<button class="draw-button" data-entry-id="${entryId}">描绘此物</button>`;
                    }
                } else {
                    html += '<p>尚未发现</p>';
                }
                html += '</div>';
            }
        }
    }

    html += '</div>'; // close codex-grid
    html += '</div>'; // close codex-container
    return html;
};

// Function to handle drawing an entry
window.drawCodexEntry = function(entryId) {
    let codexGlobalStatus = recall('codexGlobalStatus', {});
    if (State.variables.codex && State.variables.codex[entryId] && codexGlobalStatus && codexGlobalStatus[entryId]) {
        State.variables.codex[entryId].drawn = true; // Update runtime state
        codexGlobalStatus[entryId].drawn = true;    // Update persistent state
        memorize('codexGlobalStatus', codexGlobalStatus); // Persist changes

        // Recalculate drawingsMade for immediate consistency if needed by UI
        State.variables.drawingsMade = 0;
        for (const id in codexGlobalStatus) {
            if (codexGlobalStatus[id].drawn) {
                State.variables.drawingsMade++;
            }
        }

        console.log(`Entry ${entryId} marked as drawn. Global status updated and persisted.`);
        // Close the current dialog and reopen it to refresh
        if (Dialog.isOpen()) {
            Dialog.close();
            window.openCodexDialog(); // Reopen with updated content
        }
    } else {
        console.error(`Codex entry ${entryId} not found or global codex status not initialized properly.`);
    }
};

// Function to mark an entry as discovered
window.discoverCodexEntry = function(entryId) {
    let codexGlobalStatus = recall('codexGlobalStatus', {});
    if (State.variables.codex && State.variables.codex[entryId] && codexGlobalStatus && codexGlobalStatus[entryId]) {
        if (!State.variables.codex[entryId].discovered) { // Only update if not already discovered
            State.variables.codex[entryId].discovered = true; // Update runtime state
            codexGlobalStatus[entryId].discovered = true;    // Update persistent state
            memorize('codexGlobalStatus', codexGlobalStatus); // Persist changes
            console.log(`Entry ${entryId} marked as discovered. Global status updated and persisted.`);
            // If a UI element needs to be refreshed upon discovery, add code here.
            // For example, if the codex dialog is open, you might want to refresh it.
            if (Dialog.isOpen() && Dialog.title === "速写本") { // Check if codex dialog is open
                Dialog.close();
                window.openCodexDialog();
            }
        }
    } else {
        console.error(`Codex entry ${entryId} not found for discovery or global codex status not initialized properly.`);
    }
};

// Function to open the codex in a dialog
window.openCodexDialog = function() {
    const codexHTML = window.displayCodex();
    Dialog.setup("速写本", "codex-dialog"); // Title and class for the dialog
    Dialog.wiki(codexHTML);
    Dialog.open();
};

// Event listener for draw buttons (needs to be attached after the codex is rendered)
$(document).on('click', '.draw-button', function() {
    const entryId = $(this).data('entryId');
    if (entryId) {
        window.drawCodexEntry(entryId);
    }
});

// Add some basic CSS for the codex (can be moved to a separate CSS file later)
if (!$('style#codex-styles').length) {
    $('head').append(`
        <style id="codex-styles">
            .codex-container {
                padding: 20px;
                background-color: #f0f0f0; /* Light grey background */
                color: #333; /* Dark text */
                font-family: sans-serif;
            }
            .codex-container h1 {
                text-align: center;
                color: #d4af37; /* Gold color for title */
                border-bottom: 2px solid #d4af37;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .codex-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }
            .codex-entry {
                border: 1px solid #ccc;
                padding: 15px;
                border-radius: 8px;
                background-color: #fff; /* White background for entries */
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                display: flex; /* Added for better internal alignment if needed */
                flex-direction: column; /* Added for better internal alignment */
            }
            .codex-entry.locked {
                opacity: 0.6;
                background-color: #e0e0e0; /* Slightly darker for locked items */
            }
            .codex-entry h2 {
                margin-top: 0;
                color: #555;
            }
            .codex-entry .preview-desc {
                font-style: italic;
                color: #777;
            }
            .codex-image-container { /* MODIFIED */
                width: 100%;
                /* max-height: 200px; */ /* REMOVED to unrestrict height */
                /* overflow: hidden; */   /* REMOVED to unrestrict height */
                margin-bottom: 10px;
                border-radius: 4px;
            }
            .codex-image { /* MODIFIED */
                width: 100%;
                height: auto;
                display: block;
                cursor: pointer; /* Add cursor to indicate it's clickable */
            }
            .codex-entry .full-desc {
                margin-top: 10px;
            }
            .codex-entry .dominique-comment {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px dashed #ccc;
                font-size: 0.9em;
                color: #666;
            }
            .codex-entry .status-drawn {
                color: green;
                font-weight: bold;
                margin-top: 10px;
            }
            .draw-button {
                background-color: #d4af37; /* Gold button */
                color: white;
                border: none;
                padding: 10px 15px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin-top: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease;
                align-self: flex-start; /* Align button if entry is flex container */
            }
            .draw-button:hover {
                background-color: #b89a2e; /* Darker gold on hover */
            }
        </style>
    `);
}

window.unlockCodexEntry = function(entryId) {
    if (Save.slots.metadata && Save.slots.metadata.codexStatus && Save.slots.metadata.codexStatus[entryId]) {
        Save.slots.metadata.codexStatus[entryId].discovered = true;
        if (State.variables.codex && State.variables.codex[entryId]) {
            State.variables.codex[entryId].discovered = true;
        }
    }
};