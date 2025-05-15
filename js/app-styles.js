/**
 * File: js/app-styles.js (Based on user upload - AMENDED FOR TWO FILTERED DASHBOARDS)
 * Description: Handles embedding two instances of a Pyramid dashboard on the app-styles.html page.
 * Both instances are filtered by flag buttons.
 * Instance 1: Uses appStyles.
 * Instance 2: Uses contentTheme.
 * Assumes Filter and Target are available globally.
 * Relies on an existing session established via login.html.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Get references to HTML elements ---
    const embedContainer1 = document.getElementById('dashboard-embed-container'); // Instance 1
    const embedMessage1 = document.getElementById('embed-message');
    const embedContainer2 = document.getElementById('dashboard-embed-container-themed'); // Instance 2 - MUST EXIST in HTML
    const embedMessage2 = document.getElementById('embed-message-themed'); // Instance 2 - MUST EXIST in HTML
    const flagButtonAU = document.getElementById('flag-au');
    const flagButtonUK = document.getElementById('flag-uk');
    console.log("DEBUG: DOMContentLoaded fired.");

    // --- IMPORTANT CONFIGURATION ---
    const pyramidServerUrl = 'https://learn01.pyramidanalytics.com';
    const dashboardContentId = 'be88a21a-bd48-476b-93f0-15a3a763472d'; // Same dashboard ID for both
    const contentThemeId = 't-820636ce-710d'; // Theme ID for the second instance
    console.log(`DEBUG: Config - Server: ${pyramidServerUrl}, ContentID: ${dashboardContentId}, ContentThemeID: ${contentThemeId}`);

    // --- DEFINE APP STYLES THEME (UPDATED FONT) ---
    const appStyles = {
        global: { font: '0.8rem "Outfit", sans-serif', icons: { help: "fa-solid fa-question", close: "fa-solid fa-xmark", minimize: "url(data:image/png;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=)", }, }, contextMenu: { background: "#FFFFFF", border: "1px solid grey", borderRadius: "5px", icons: { menuItemArrowRight: "fa-solid fa-angle-right", menuItemArrowLeft: "fa-solid fa-angle-left", }, separator: { color: "#e1821f", }, menuItem: { color: "#333", font: '14px "Outfit", sans-serif', hover: { background: "#f0f0f0", color: "#000", }, icons: { analyzeFurther: "fa-solid fa-chart-line", bookmarks: "fa-regular fa-bookmark", chatbot: "fa-solid fa-robot", copyColumn: "fa-solid fa-copy", copyContent: "fa-solid fa-clipboard", copyDataPointValue: "fa-solid fa-database", copyHeaderValue: "fa-solid fa-heading", copyMemberValue: "fa-solid fa-user", copyRow: "fa-solid fa-table", copySelections: "fa-solid fa-check-double", dataInteractions: "fa-solid fa-exchange-alt", drillToLevel: "fa-solid fa-level-up-alt", eliminate: "fa-solid fa-trash", eliminateDataPoint: "fa-solid fa-filter-circle-xmark", exitFullscreen: "fa-solid fa-compress", extendedOperations: "fa-solid fa-cogs", focus: "fa-solid fa-bullseye", focusAndInteract: "fa-solid fa-arrows-to-circle", focusDataPoint: "fa-solid fa-crosshairs", fullscreen: "fa-solid fa-expand", information: "fa-solid fa-info-circle", memberSelection: "fa-solid fa-users", modelAttribute: "fa-solid fa-tag", modelDimension: "fa-solid fa-right-to-bracket", modelHierarchy: "fa-solid fa-sitemap", modelLevel: "fa-solid fa-layer-group", modelMember: "fa-solid fa-user-tag", newBookmark: "fa-solid fa-bookmark", pyramidActions: "fa-solid fa-sort-amount-up", quickCalc: "fa-solid fa-calculator", rating: "fa-solid fa-star", redo: "fa-solid fa-redo", removeFromQuery: "fa-solid fa-times", rerunQueries: "fa-solid fa-sync", reset: "fa-solid fa-undo-alt", runSlicers: "fa-solid fa-play", selectedMembers: "fa-solid fa-check", showConversation: "fa-solid fa-comments", startConversation: "fa-solid fa-comment-dots", toggleMultiHighlightMode: "fa-solid fa-highlighter", undo: "fa-solid fa-undo", swap: "fa-solid fa-random", addToQuery: "fa-solid fa-plus", dice: "fa-solid fa-dice", resetQuery: "fa-solid fa-refresh", changeVisual: "fa-solid fa-palette", odata: "fa-solid fa-database", printReport: "fa-solid fa-file-pdf", printReportPdf: "fa-solid fa-file-pdf", printReportPng: "fa-solid fa-file-image", printReportExcel: "fa-solid fa-file-excel", printReportCsv: "fa-solid fa-file-csv", conditionalFormatting: "fa-solid fa-fill-drip", pivot: "fa-solid fa-table-columns", sortWizard: "fa-solid fa-sort", copyRawData: "fa-solid fa-copy", copyVisualData: "fa-solid fa-chart-bar", showRangeSlider: "fa-solid fa-sliders-h", copyOdataLink: "fa-solid fa-link", copyOdataLinkNoFilter: "fa-solid fa-unlink", copyOdataSnippet: "fa-solid fa-code", copyOdataSnippetNoFilters: "fa-solid fa-code-branch", quickSort: "fa-solid fa-sort-amount-down", quickFilter: "fa-solid fa-filter", }, }, }, smartInsights: { background: "#f7f7f7", contentSection: { title: { font: 'bold 16px "Outfit", sans-serif', color: "#333", }, measure: { font: 'italic 14px "Outfit", sans-serif', color: "#555", }, value: { font: 'bold 18px "Outfit", sans-serif', color: "#000", }, }, icons: { logo: "url(https://example.com/logo.png)", }, }, present: { sideMenu: { background: "#272856", color: "#FFF", font: '14px "Outfit", sans-serif', border: "1px solid #444", borderRadius: "8px", boxShadow: "2px 2px 5px rgba(0,0,0,0.5)", header: { background: "#1c1c4e", color: "#FFF", font: '14px "Outfit", sans-serif', }, icons: { rerunQueries: "fa-solid fa-sync", multiHighlight: "fa-solid fa-highlighter", }, controls: { toggle: { on: { background: "#28a745", }, off: { background: "#dc3545", }, }, }, }, }, dialog: { borderRadius: "10px", header: { background: "#007bff", color: "#FFF", font: 'bold 16px "Outfit", sans-serif', }, footer: { background: "#f1f1f1", button: { background: "#007bff", color: "#FFF", font: '14px "Outfit", sans-serif', }, }, }, chatbot: { background: "#f8f9fa", icons: { reset: "fa-solid fa-undo", clearMessages: "fa-solid fa-trash-alt", newQuery: "fa-solid fa-search", mute: "fa-solid fa-volume-mute", unmute: "fa-solid fa-volume-up", logo: "url(https://example.com/chatbot-logo.png)", }, message: { incoming: { background: "#e9ecef", font: '14px "Outfit", sans-serif', color: "#333", border: "1px solid #ccc", borderRadius: "5px", }, outgoing: { background: "#007bff", font: '14px "Outfit", sans-serif', color: "#FFF", border: "1px solid #0056b3", borderRadius: "5px", }, userAvatar: { background: "#007bff", color: "#FFF", }, }, input: { font: '14px "Outfit", sans-serif', color: "#000", icons: { send: "fa-solid fa-paper-plane", startRecording: "fa-solid fa-microphone", stopRecording: "fa-solid fa-microphone-slash", recordingNow: "fa-solid fa-circle-dot", }, }, },
    };
    console.log("DEBUG: appStyles object defined with Outfit font."); // UPDATED DEBUG MESSAGE

    // Store the client globally within this scope
    let pyramidClient;
    // Assume 'Filter' and 'Target' are globally available

    // --- Basic null checks for essential elements ---
    if (!embedContainer1 || !embedMessage1 || !flagButtonAU || !flagButtonUK || !embedContainer2 || !embedMessage2) {
        console.error('App Styles page error: Required HTML elements missing.');
        const availableMessageElement = embedMessage1 || embedMessage2;
        if (availableMessageElement) { availableMessageElement.textContent = 'Page setup error.'; availableMessageElement.className = 'error'; }
        return;
    }
    console.log("DEBUG: Basic element null checks passed.");

    // --- Check library dependencies ---
    if (typeof PyramidEmbedClient === 'undefined') { console.error('PyramidEmbedClient is not defined.'); (embedMessage1 || embedMessage2).textContent = 'Error: PyramidEmbedClient library not found.'; return; }
    console.log("DEBUG: PyramidEmbedClient library found.");
    if (typeof Filter === 'undefined' || typeof Filter.byUniqueName !== 'function') { console.error('"Filter" missing or invalid.'); (embedMessage1 || embedMessage2).textContent = 'Error: Global "Filter" object/class not found.'; return; }
    if (typeof Target === 'undefined' || typeof Target.create !== 'function') { console.error('"Target" missing or invalid.'); (embedMessage1 || embedMessage2).textContent = 'Error: Global "Target" object/class not found.'; return; }
    console.log("DEBUG: Global Filter (with byUniqueName) and Target objects found.");

    // --- Instantiate the Pyramid Embed Client ---
    try {
         pyramidClient = new PyramidEmbedClient(pyramidServerUrl);
         console.log('DEBUG: PyramidEmbedClient initialized successfully.');
    } catch (error) {
        console.error('Error initializing PyramidEmbedClient:', error);
        (embedMessage1 || embedMessage2).textContent = `Error initializing Pyramid client: ${error.message}`;
        return;
    }

    /**
     * Embeds or re-embeds BOTH dashboard instances, applying the same filter
     * but different styling options (appStyles vs contentTheme).
     * @param {string | null} countryUniqueName - The unique name for filtering, or null to load without filter.
     */
    const embedDashboardsWithFilter = async (countryUniqueName) => {
        console.log(`DEBUG: embedDashboardsWithFilter called with countryUniqueName: ${countryUniqueName}`);
        // Check dependencies
        if (!pyramidClient || !embedContainer1 || !embedMessage1 || !embedContainer2 || !embedMessage2 || typeof Filter === 'undefined' || typeof Filter.byUniqueName !== 'function' || typeof Target === 'undefined' || typeof Target.create !== 'function') {
            console.error('Cannot embed/filter: Dependencies missing.');
            if(embedMessage1) embedMessage1.textContent = 'Error: Dependencies missing.';
            if(embedMessage2) embedMessage2.textContent = 'Error: Dependencies missing.';
            return;
        }

        let targetObject = undefined; // Initialize target object

        // Create Filter and Target objects if a country is specified
        if (countryUniqueName) {
            console.log(`DEBUG: Creating filter using Filter.byUniqueName for: ${countryUniqueName}`);
            try {
                const filter = Filter.byUniqueName(countryUniqueName);
                targetObject = Target.create().add(filter, 'countryFilter', false); // Create the common target
                console.log("DEBUG: Shared Target object created:", targetObject);
            } catch (creationError) {
                 console.error('Error creating filter or target:', creationError);
                 if(embedMessage1) embedMessage1.textContent = `Error creating filter/target: ${creationError.message}`;
                 if(embedMessage2) embedMessage2.textContent = `Error creating filter/target: ${creationError.message}`;
                 return;
            }
        } else {
            console.log('DEBUG: Embedding both dashboards without specific country filter (no target).');
        }

        // --- Define options for BOTH dashboards ---
        // Options for Instance 1 (uses appStyles)
        const embedOptions1 = {
            contentId: dashboardContentId,
            theme: "light",
            targets: targetObject, // Apply the common target object (or undefined if no filter)
            appStyles: appStyles // Use the updated appStyles
        };

        // Options for Instance 2 (uses contentTheme)
        const embedOptions2 = {
            contentId: dashboardContentId,
            theme: "light",
            targets: targetObject, // Apply the common target object (or undefined if no filter)
            contentTheme: contentThemeId
        };

        console.log("DEBUG: Attempting to embed/re-embed INSTANCE 1 with options:", embedOptions1);
        console.log("DEBUG: Attempting to embed/re-embed INSTANCE 2 with options:", embedOptions2);

        // Display loading messages
        embedMessage1.textContent = countryUniqueName ? 'Applying filter...' : 'Loading Dashboard 1...';
        embedMessage1.className = '';
        embedMessage1.style.display = 'block';
        embedMessage2.textContent = countryUniqueName ? 'Applying filter...' : 'Loading Dashboard 2...';
        embedMessage2.className = '';
        embedMessage2.style.display = 'block';

        // --- Embed BOTH dashboards ---
        // We can embed them concurrently using Promise.all for potential speedup
        try {
            if (typeof pyramidClient.embed !== 'function') { throw new Error('pyramidClient.embed is not a function.'); }

            console.log("DEBUG: Calling pyramidClient.embed for both instances...");
            await Promise.all([
                pyramidClient.embed(embedContainer1, embedOptions1),
                pyramidClient.embed(embedContainer2, embedOptions2)
            ]);
            console.log("DEBUG: pyramidClient.embed calls finished for both instances.");

            // Hide messages on success
            embedMessage1.style.display = 'none';
            embedMessage2.style.display = 'none';
            console.log('Both dashboards embedded/filtered successfully.');

        } catch (embedError) {
            // Handle Embedding Errors - Show error on both potentially
            console.error('Error embedding/filtering one or both dashboards:', embedError);
            embedMessage1.textContent = `Error: ${embedError.message || 'Check console.'}`;
            embedMessage1.className = 'error';
            embedMessage1.style.display = 'block';
            embedMessage2.textContent = `Error: ${embedError.message || 'Check console.'}`;
            embedMessage2.className = 'error';
            embedMessage2.style.display = 'block';
        }
    };

    /**
     * Updates the visual selection state of the buttons.
     */
    const updateButtonSelection = (selectedButton) => {
        console.log("DEBUG: updateButtonSelection called.");
        flagButtonAU.classList.remove('selected');
        flagButtonUK.classList.remove('selected');
        if (selectedButton) {
            selectedButton.classList.add('selected');
            console.log(`DEBUG: Added .selected class to ${selectedButton.id}`);
        }
    };

    // --- Add Event Listeners to Flag Buttons ---
    // These listeners now call the combined function
    if (flagButtonAU) {
        flagButtonAU.addEventListener('click', () => {
            console.log("DEBUG: Australia flag button clicked.");
            updateButtonSelection(flagButtonAU);
            embedDashboardsWithFilter('[Customers].[Country].[Australia]'); // Call combined function
        });
        console.log("DEBUG: Event listener added for Australia button.");
    } else { console.error("DEBUG: Australia button not found."); }

    if (flagButtonUK) {
        flagButtonUK.addEventListener('click', () => {
            console.log("DEBUG: UK flag button clicked.");
            updateButtonSelection(flagButtonUK);
            embedDashboardsWithFilter('[Customers].[Country].[United Kingdom]'); // Call combined function
        });
        console.log("DEBUG: Event listener added for UK button.");
    } else { console.error("DEBUG: UK button not found."); }


    // --- Execute the initial embedding process for BOTH dashboards ---
    console.log("DEBUG: Calling initial embedDashboardsWithFilter(null)...");
    embedDashboardsWithFilter(null); // Load both dashboards initially (no filter)

});