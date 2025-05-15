document.addEventListener('DOMContentLoaded', () => {
    // Get references to elements
    const hubContentDiv = document.getElementById('hub-content');
    const hubMessageElement = document.getElementById('hub-message');

    // --- IMPORTANT CONFIGURATION ---
    const pyramidServerUrl = 'https://learn01.pyramidanalytics.com'; // Replace! Use HTTPS.
    // --- END CONFIGURATION ---

     // Basic null checks for essential elements
    if (!hubContentDiv || !hubMessageElement) {
        console.error('Hub page error: One or more required HTML elements not found.');
        // Maybe redirect back to login if container is missing?
        // window.location.href = 'login.html';
        return;
    }

    // Check if the Pyramid Embed Client library loaded
    if (typeof PyramidEmbedClient === 'undefined') {
        hubMessageElement.textContent = 'Error: PyramidEmbedClient library not found. Check the script tag in hub.html.';
        hubMessageElement.className = 'error';
        console.error('PyramidEmbedClient is not defined.');
        return;
    }

    // Instantiate the Pyramid Embed Client
    let pyramidClient;
    try {
         pyramidClient = new PyramidEmbedClient(pyramidServerUrl);
         console.log('PyramidEmbedClient initialized for Hub embedding.');
    } catch (error) {
        hubMessageElement.textContent = `Error initializing Pyramid client: ${error.message}`;
        hubMessageElement.className = 'error';
        console.error('Error initializing PyramidEmbedClient:', error);
        return;
    }

    // --- Attempt to embed the Hub directly ---
    // We assume the user is already authenticated via a session cookie
    // established during the login on login.html.
    // We DO NOT call pyramidClient.login() or loginWithToken() here in this flow.

    const embedHub = async () => {
        // Options for embedding the Hub
        const hubOptions = {
            theme: "light",       // "light" or "dark"
            editable: true,       // Allow editing actions if permissions allow
            showTabs: true,       // Show the standard Hub tabs
            responsiveness: "compact" // Adjust layout for container size
        };

        console.log('Attempting to embed Hub directly into #hub-content, assuming existing session.');
        hubMessageElement.textContent = 'Loading Hub...'; // Reset message
        hubMessageElement.className = '';


        try {
            // Embed the hub into the 'hub-content' div
            const hubInstance = await pyramidClient.hub(hubContentDiv, hubOptions);

            // If embedding is successful, remove the loading message
            hubMessageElement.style.display = 'none'; // Hide the message element
            console.log('Hub embedded successfully.', hubInstance);

        } catch (embedError) {
            console.error('Error embedding Hub:', embedError);
            hubMessageElement.textContent = `Error embedding Hub: ${embedError.message || 'Authentication likely failed or session expired.'}`;
            hubMessageElement.className = 'error';

            // Optional: Redirect back to login page if embedding fails due to auth
            // You might want to check the specific error type if possible
            // For simplicity, we'll redirect on any embedding error here.
            console.log('Redirecting back to login page due to embedding error.');
            // Add a small delay so user might see the error message
            setTimeout(() => {
                 window.location.href = 'login.html';
            }, 5000); // 5 second delay
        }
    };

    // Execute the embedding process
    embedHub();

});