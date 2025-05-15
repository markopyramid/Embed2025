/**
 * File: js/present-example.js
 * Description: Handles embedding a Pyramid "Present" dashboard on the present-example.html page
 * and adds functionality to page navigation buttons using goToSlide.
 * Relies on an existing session established via login.html.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Get references to HTML elements ---
    const embedContainer = document.getElementById('present-dashboard-container');
    const embedMessageElement = document.getElementById('present-embed-message');
    const page1Button = document.getElementById('presentPage1');
    const page2Button = document.getElementById('presentPage2');
    const page3Button = document.getElementById('presentPage3');
    const pageButtons = [page1Button, page2Button, page3Button]; // Array for easier management

    console.log("DEBUG: DOMContentLoaded fired for present-example.js.");

    // --- IMPORTANT CONFIGURATION ---
    const pyramidServerUrl = 'https://learn01.pyramidanalytics.com'; // Ensure this matches login.js
    // !!! REPLACE THIS WITH THE ACTUAL CONTENT ID OF YOUR "PRESENT" DASHBOARD !!!
    const presentDashboardContentId = '46301413-c1b8-41ec-992d-ca6b79436858'; 
    console.log(`DEBUG: Config - Server: ${pyramidServerUrl}, Present Dashboard ContentID: ${presentDashboardContentId}`);

    // --- Variable to store the EmbeddedResult instance ---
    let currentEmbeddedDashboardResult = null;

    // --- Basic null checks for essential elements ---
    if (!embedContainer || !embedMessageElement || !page1Button || !page2Button || !page3Button) {
        console.error('Present Example page error: Required HTML elements (container, message, or page buttons) not found.');
        if (embedMessageElement) {
            embedMessageElement.textContent = 'Page setup error: Crucial elements missing.';
            embedMessageElement.className = 'error';
        }
        return; 
    }
    console.log("DEBUG: Basic element null checks passed for present-example.js.");

    // --- Check if the Pyramid Embed Client library loaded ---
    if (typeof PyramidEmbedClient === 'undefined') {
        embedMessageElement.textContent = 'Error: PyramidEmbedClient library not found. Check the script tag.';
        embedMessageElement.className = 'error';
        console.error('PyramidEmbedClient is not defined.');
        return;
    }
    console.log("DEBUG: PyramidEmbedClient library found.");

    // --- Instantiate the Pyramid Embed Client ---
    let pyramidClient;
    try {
         pyramidClient = new PyramidEmbedClient(pyramidServerUrl);
         console.log('DEBUG: PyramidEmbedClient initialized for Present Example embedding.');
    } catch (error) {
        embedMessageElement.textContent = `Error initializing Pyramid client: ${error.message}`;
        embedMessageElement.className = 'error';
        console.error('Error initializing PyramidEmbedClient:', error);
        return;
    }

    /**
     * Updates the active state of the page buttons.
     * @param {number} activeSlideNumber - The 1-indexed slide number that is now active.
     */
    function setActiveButton(activeSlideNumber) {
        pageButtons.forEach((button, index) => {
            if ((index ) === activeSlideNumber) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    /**
     * Handles navigation to a specific slide.
     * @param {number} slideNumber - The 1-indexed slide number to navigate to.
     */
    function goToPresentSlide(slideNumber) {
        if (!currentEmbeddedDashboardResult) {
            console.warn('goToPresentSlide: Dashboard result not available yet.');
            embedMessageElement.textContent = 'Dashboard not fully loaded. Please wait.';
            embedMessageElement.className = 'error'; // Or a 'warning' class
            embedMessageElement.style.display = 'block';
            return;
        }
        if (typeof currentEmbeddedDashboardResult.goToSlide !== 'function') {
            console.error('goToPresentSlide: goToSlide method not found on embedded result.');
            embedMessageElement.textContent = 'Error: Slide navigation not supported by this embedded content.';
            embedMessageElement.className = 'error';
            embedMessageElement.style.display = 'block';
            return;
        }

        try {
            console.log(`DEBUG: Calling goToSlide(${slideNumber})`);
            currentEmbeddedDashboardResult.goToSlide(slideNumber);
            setActiveButton(slideNumber); // Update button visual state
            if (embedMessageElement.style.display === 'block' && embedMessageElement.className !== 'error') {
                embedMessageElement.style.display = 'none'; // Hide non-error messages after interaction
            }
        } catch (error) {
            console.error(`Error calling goToSlide(${slideNumber}):`, error);
            embedMessageElement.textContent = `Error navigating to slide ${slideNumber}: ${error.message}`;
            embedMessageElement.className = 'error';
            embedMessageElement.style.display = 'block';
        }
    }

    /**
     * Embeds the "Present" dashboard.
     */
    const embedPresentDashboard = async () => {
        if (!pyramidClient) {
            console.error('Cannot embed: Pyramid client not initialized.');
            embedMessageElement.textContent = 'Error: Client not ready.';
            embedMessageElement.className = 'error';
            return;
        }

        if (presentDashboardContentId === 'YOUR_PRESENT_DASHBOARD_CONTENT_ID_HERE') {
            const msg = 'Configuration needed: Please replace "YOUR_PRESENT_DASHBOARD_CONTENT_ID_HERE" in js/present-example.js with an actual dashboard ID.';
            console.warn(msg);
            embedMessageElement.textContent = msg;
            embedMessageElement.className = 'error';
            return;
        }
        
        const embedOptions = {
            contentId: presentDashboardContentId,
            theme: "light",
            /**
             * onLoad callback: Called when the content is successfully embedded.
             * Receives an 'EmbeddedResult' object which contains methods to interact with the content.
             * @param {object} result - The EmbeddedResult object.
             */
            onLoad: (result) => {
                console.log('DEBUG: Present Dashboard onLoad callback triggered. Result:', result);
                currentEmbeddedDashboardResult = result; // Store the result

                // You can check available methods on the result object
                if (result && typeof result.goToSlide === 'function') {
                    console.log('DEBUG: goToSlide method is available on the embedded result.');
                } else {
                    console.warn('DEBUG: goToSlide method is NOT available on the embedded result. Page buttons may not work.');
                }
                
                // Optionally, set the first page as active by default if dashboard loads to slide 1
                // This depends on whether the dashboard automatically shows the first slide or if an initial goToSlide(1) is needed
                // For now, we'll let manual clicks set the active state.
                // setActiveButton(1); // Or get current slide if API allows: result.getCurrentSlide()
            },
            // onError callback (optional, but good for debugging)
            onError: (error) => {
                console.error('DEBUG: onError callback triggered during embedding. Error:', error);
                embedMessageElement.textContent = `Error during embedding: ${error.message || 'Unknown error'}`;
                embedMessageElement.className = 'error';
                embedMessageElement.style.display = 'block';
                currentEmbeddedDashboardResult = null; // Clear any previous result
            }
        };

        console.log(`DEBUG: Attempting to embed Present dashboard ID: ${presentDashboardContentId} with options:`, embedOptions);
        embedMessageElement.textContent = 'Loading Present Dashboard...';
        embedMessageElement.className = ''; 
        embedMessageElement.style.display = 'block';

        try {
            if (typeof pyramidClient.embed !== 'function') {
                throw new Error('pyramidClient.embed is not a function.');
            }
            // The embed method itself might return a promise that resolves to the EmbeddedResult,
            // but the onLoad callback is a more direct way to get it for interactions.
            await pyramidClient.embed(embedContainer, embedOptions);

            // If embedding call itself is successful (doesn't throw), hide the initial loading message.
            // The onLoad callback will handle further logic.
            embedMessageElement.style.display = 'none';
            console.log('Present Dashboard embedding process initiated.');

        } catch (embedError) {
            console.error('Error initiating Present dashboard embedding:', embedError);
            embedMessageElement.textContent = `Error embedding dashboard: ${embedError.message || 'Check console, content ID, and permissions.'}`;
            embedMessageElement.className = 'error';
            embedMessageElement.style.display = 'block';
            currentEmbeddedDashboardResult = null; // Clear on error
        }
    };

    // --- Add Event Listeners to Page Buttons ---
    page1Button.addEventListener('click', () => goToPresentSlide(0));
    page2Button.addEventListener('click', () => goToPresentSlide(1));
    page3Button.addEventListener('click', () => goToPresentSlide(2));
    console.log("DEBUG: Event listeners added to page buttons.");

    // --- Execute the initial embedding process ---
    console.log("DEBUG: Calling initial embedPresentDashboard()...");
    embedPresentDashboard();

});
