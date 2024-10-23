// Function to display scan results
function displayScanResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (data.error) {
        resultsContainer.innerHTML = `<p>Error: ${data.error.message}</p>`;
        return;
    }

    const { data: scanData } = data;
    const stats = scanData.attributes.stats;
    const malwareCount = stats.malicious + stats.suspicious;

    // Create a message indicating the number of types of malware found
    const message = `The scan found ${malwareCount} type${malwareCount !== 1 ? 's' : ''} of malware.`;

    // Create the scan report
    const fileReport = `
        <h3>Scan Report for File</h3>
        <p>${message}</p>
        <p><strong>File Name:</strong> ${scanData.attributes.name}</p>
        <p><strong>File Size:</strong> ${scanData.attributes.size} bytes</p>
        <p><strong>Scan Date:</strong> ${new Date(scanData.attributes.last_analysis_date * 1000).toLocaleString()}</p>
        <h4>Analysis Results:</h4>
        ${Object.entries(scanData.attributes.last_analysis_results).map(([vendor, result]) => `
            <p><strong>${vendor}:</strong> ${result.category} (${result.result || 'No result'})</p>
        `).join('')}
    `;

    resultsContainer.innerHTML = fileReport; // Insert results into the container
}

// Function to trigger the file scan
function scanFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a file to scan.');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // Make a POST request to the server
    fetch('http://localhost:3000/scan', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.id) {
                // Poll for the analysis results
                pollForResults(data.data.id);
            } else {
                resultsContainer.innerHTML = `<p>Failed to initiate file scan.</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultsContainer.innerHTML = `<p>Error initiating file scan: ${error.message}</p>`;
        });
}

// Function to poll for the analysis results using the analysis ID
function pollForResults(analysisId) {
    const pollInterval = 5000; // 5 seconds
    const maxAttempts = 20;
    let attempts = 0;

    const poll = () => {
        fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
            headers: {
                'x-apikey': 'YOUR_VIRUSTOTAL_API_KEY', // Replace with your VirusTotal API key
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.attributes && data.data.attributes.status === 'completed') {
                    displayScanResults(data);
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(poll, pollInterval);
                } else {
                    resultsContainer.innerHTML = `<p>Analysis timed out. Please try again later.</p>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultsContainer.innerHTML = `<p>Error fetching analysis results: ${error.message}</p>`;
            });
    };

    poll(); // Start polling
}

// Add event listener to the scan button
document.getElementById('scanButton').addEventListener('click', scanFile);
// Function to check URLs using Google Safe Browsing API
function checkURL(url) {
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your Google API key
    const apiURL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    const body = {
        client: { clientId: "syfo", clientVersion: "1.0" },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
        }
    };

    fetch(apiURL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
            if (data.matches) {
                alert("Warning! This link may be a phishing site.");
            } else {
                alert("This URL seems safe.");
            }
        })
        .catch(error => {
            console.error('Error with Google Safe Browsing API:', error);
            alert('Error: Unable to check URL.');
        });
}