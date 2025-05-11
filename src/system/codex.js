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
                        html += `<p class="dominique-comment">${entry.dominiqueComment || (entry.dominiqueComment_accepted && State.variables.playerChoice === 'accepted' ? entry.dominiqueComment_accepted : entry.dominiqueComment_refused || '')}</p>`;
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
                padding: 25px;
                background-color: #f7f3e8; /* 米黄色纸张底色 */
                color: #333;
                font-family: 'Noto Serif', 'Times New Roman', serif;
                border-radius: 5px;
                border: 1px solid #d4af37;
                box-shadow: 0 3px 15px rgba(0, 0, 0, 0.3), inset 0 0 80px rgba(218, 197, 154, 0.2);
                background-image: 
                  url('data:image/png;base64,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');
                position: relative;
            }
            
            .codex-container:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                  linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
                background-size: 20px 20px;
                pointer-events: none;
                z-index: 1;
            }
            
            .codex-container h1 {
                text-align: center;
                color: #543c0c;
                border-bottom: 2px solid #d4af37;
                padding-bottom: 15px;
                margin-bottom: 25px;
                font-weight: bold;
                letter-spacing: 1px;
                text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
                font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
            }
            
            .codex-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
                position: relative;
                z-index: 2;
            }
            
            .codex-entry {
                border: 1px solid #d4b15a;
                padding: 15px;
                border-radius: 5px;
                background-color: rgba(255, 250, 230, 0.7);
                box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .codex-entry:hover {
                border-color: #d4af37;
                box-shadow: 3px 3px 12px rgba(0,0,0,0.15);
                transform: translateY(-3px);
            }
            
            .codex-entry:after {
                content: '';
                position: absolute;
                bottom: 0;
                right: 0;
                width: 30px;
                height: 30px;
                background: linear-gradient(135deg, transparent 50%, rgba(212, 177, 90, 0.2) 50%);
                border-radius: 0 0 5px 0;
            }
            
            .codex-entry.locked {
                opacity: 0.7;
                background-color: rgba(230, 230, 230, 0.5);
                border-color: #aaa;
                box-shadow: none;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text x="50%" y="50%" font-size="20" text-anchor="middle" dominant-baseline="middle" font-family="serif" fill="rgba(100,100,100,0.2)">未发现</text></svg>');
                background-repeat: no-repeat;
                background-position: center;
                background-size: 80% 80%;
            }
            
            .codex-entry.locked:hover {
                transform: none;
            }
            
            .codex-entry h2 {
                margin-top: 0;
                color: #7d5709;
                border-bottom: 1px solid rgba(212, 177, 90, 0.5);
                padding-bottom: 8px;
                font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
            }
            
            .codex-entry .preview-desc {
                font-style: italic;
                color: #666;
                margin-bottom: 12px;
                font-family: 'Times New Roman', Times, serif;
            }
            
            .codex-image-container {
                width: 100%;
                margin-bottom: 15px;
                border-radius: 3px;
                overflow: hidden;
                border: 1px solid #d4b15a;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                position: relative;
            }
            
            .codex-image-container:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
                pointer-events: none;
                z-index: 2;
            }
            
            .codex-image {
                width: 100%;
                height: auto;
                display: block;
                cursor: pointer;
                transition: transform 0.3s ease;
                filter: sepia(10%);
            }
            
            .codex-image:hover {
                transform: scale(1.02);
                filter: sepia(0%);
            }
            
            .codex-entry .full-desc {
                margin-top: 15px;
                color: #333;
                line-height: 1.5;
                font-family: 'Times New Roman', Times, serif;
            }
            
            .codex-entry .dominique-comment {
                margin-top: 15px;
                padding-top: 12px;
                border-top: 1px dashed rgba(212, 177, 90, 0.5);
                font-size: 0.95em;
                color: #666;
                font-style: italic;
                font-family: 'Noto Serif', serif;
            }
            
            .codex-entry .status-drawn {
                color: #9c7412;
                font-weight: bold;
                margin-top: 15px;
                text-align: center;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" viewBox="0 0 100 30"><path d="M0,15 C20,5 40,25 50,15 C60,5 80,25 100,15" stroke="rgba(156,116,18,0.3)" fill="none" stroke-width="2" /></svg>');
                background-repeat: no-repeat;
                background-position: center;
                background-size: 100% 100%;
                padding: 5px 0;
            }
            
            .draw-button {
                background-color: #f8f4e5;
                color: #9c7412;
                border: 1px solid #d4af37;
                padding: 10px 15px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin-top: 12px;
                cursor: pointer;
                border-radius: 3px;
                transition: all 0.3s ease;
                align-self: center;
                width: 100%;
                position: relative;
                overflow: hidden;
                box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
                font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
            }
            
            .draw-button:hover {
                background-color: #d4af37;
                color: #fff;
                box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
            }
            
            .draw-button:before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transition: left 0.5s ease;
                z-index: 1;
            }
            
            .draw-button:hover:before {
                left: 100%;
            }
            
            #codex-dialog {
                max-width: 90% !important;
                width: 1000px !important;
                background-color: transparent !important;
                border: none !important;
                box-shadow: 0 0 30px rgba(0,0,0,0.4) !important;
            }
            
            /* 添加古董边框样式 */
            .codex-container {
                position: relative;
            }
            
            .codex-container:after {
                content: '';
                position: absolute;
                top: 8px;
                left: 8px;
                right: 8px;
                bottom: 8px;
                border: 1px solid rgba(156, 116, 18, 0.3);
                pointer-events: none;
                z-index: 0;
            }
            
            /* 添加墨水渍和铅笔痕迹 */
            .codex-entry.drawn:before {
                content: '';
                position: absolute;
                width: 40px;
                height: 40px;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="rgba(100,50,0,0.04)"/></svg>');
                top: 10px;
                right: 10px;
                opacity: 0.8;
                transform: rotate(10deg);
                pointer-events: none;
                z-index: 0;
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