document.addEventListener('DOMContentLoaded', () => {
    // Get references to elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageElement = document.getElementById('message');

    // --- IMPORTANT CONFIGURATION ---
    const pyramidServerUrl = 'https://learn01.pyramidanalytics.com'; // Replace! Use HTTPS.
    // --- END CONFIGURATION ---

    // Basic null checks for essential elements
    if (!loginForm || !usernameInput || !passwordInput || !messageElement) {
        console.error('Login page error: One or more required HTML elements not found.');
        if (messageElement) messageElement.textContent = 'Page setup error.';
        return;
    }

    // Check if the Pyramid Embed Client library loaded
    if (typeof PyramidEmbedClient === 'undefined') {
        messageElement.textContent = 'Error: PyramidEmbedClient library not found. Check the script tag in login.html.';
        messageElement.className = 'error';
        console.error('PyramidEmbedClient is not defined.');
        return;
    }

    // Instantiate the Pyramid Embed Client
    let pyramidClient;
    try {
         pyramidClient = new PyramidEmbedClient(pyramidServerUrl);
         console.log('PyramidEmbedClient initialized for login.');
    } catch (error) {
        messageElement.textContent = `Error initializing Pyramid client: ${error.message}`;
        messageElement.className = 'error';
        console.error('Error initializing PyramidEmbedClient:', error);
        return;
    }

    // Attach login form submit listener
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        messageElement.textContent = 'Logging in...';
        messageElement.className = ''; // Clear previous styling

        if (!username || !password) {
            messageElement.textContent = 'Please enter both username and password.';
            messageElement.className = 'error';
            return;
        }

        console.log(`Attempting login for user: ${username}`);

        try {
            // --- Step 1: Authenticate using username/password ---
            // This should establish a session (e.g., via cookies)
            await pyramidClient.login(username, password);

            console.log('Pyramid login successful. Session established.');
            messageElement.textContent = 'Login successful! Redirecting...';
            messageElement.className = 'success';

            // --- Step 2: Redirect to the Hub page ---
            // The browser should automatically send the session cookie with the request for hub.html
            window.location.href = 'hub.html';

        } catch (loginError) {
            // Handle Login errors
            messageElement.textContent = `Login failed: ${loginError.message || 'Check credentials or server connection.'}`;
            messageElement.className = 'error';
            console.error('Pyramid login failed:', loginError);
        }
    });
});