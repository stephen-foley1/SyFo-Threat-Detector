document.addEventListener('DOMContentLoaded', function() {
    // Event listener for scanning a manually entered URL
    document.getElementById('scanUrlBtn').addEventListener('click', function() {
        console.log('Scan URL button clicked');
        const url = document.getElementById('urlInput').value;
        if (url) {
            checkURL(url);
        } else {
            alert("Please enter a valid URL.");
        }
    });

    // Event listener for scanning a manually uploaded file
    document.getElementById('scanFileBtn').addEventListener('click', function() {
        console.log('Scan File button clicked');
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        if (file) {
            console.log('File selected for upload:', file.name);
            const formData = new FormData();
            formData.append('file', file);

            fetch('http://167.99.200.62:3000/scan', {  // Updated URL
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Response from server:', data);
                    displayScanResult(data); // Call the function to display results
                })
                .catch(error => {
                    console.error('Error communicating with the server:', error);
                    alert('Error: Unable to communicate with the server.');
                });
        } else {
            alert("Please select a file to scan.");
        }
    });

    // Event listener for scanning an additional uploaded file
    const scanBtn = document.getElementById('scanBtn');
    if (scanBtn) {
        scanBtn.addEventListener('click', function() {
            console.log('Scan via scanBtn clicked');
            const fileInput = document.getElementById('attachment');
            const file = fileInput.files[0];
            if (file) {
                console.log('File selected for scan via scanBtn:', file.name);
                const formData = new FormData();
                formData.append('file', file);

                fetch('http://167.99.200.62:3000/scan', {  // Updated URL
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Response from server via scanBtn:', data);
                        displayScanResult(data); // Call the function to display results
                    })
                    .catch(error => {
                        console.error('Error communicating with the server via scanBtn:', error);
                        alert('Error: Unable to communicate with the server.');
                    });
            } else {
                alert("Please select a file to scan.");
            }
        });
    } else {
        console.error('Element with id "scanBtn" not found.');
    }
});

// Example function to display the scan results
function displayScanResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (data.error) {
        resultsContainer.innerHTML = `Error: ${data.error.message}`;
        return;
    }

    const { data: scanData } = data;
    const stats = scanData.attributes.stats;
    const malwareCount = stats.malicious + stats.suspicious;

    const message = `The scan found ${malwareCount} type${malwareCount !== 1 ? 's' : ''} of malware.`;

    // Create the scan report
    const fileReport = `
    <h3>Scan Report for File</h3>
    <p>${message}</p>
    <p>File Name: ${scanData.attributes.name}</p>
    <p>File Size: ${scanData.attributes.size} bytes</p>
    <p>Scan Date: ${new Date(scanData.attributes.last_analysis_date * 1000).toLocaleString()}</p>
    <h4>Analysis Results:</h4>
    ${Object.entries(scanData.attributes.last_analysis_results).map(([vendor, result]) => `
        <p>${vendor}: ${result.category} (${result.result || 'No result'})</p>
    `).join('')}
    `;

    resultsContainer.innerHTML = fileReport; // Insert results into the container
} console.log("Scan Results:", data.scanResults);
}

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