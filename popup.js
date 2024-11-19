document.addEventListener('DOMContentLoaded', function() {
    // Event listener for scanning a manually uploaded file
    document.getElementById('scanFileBtn').addEventListener('click', function() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch('http://167.99.200.62:3000/scan', {
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
                    if (data.malicious) {
                        alert(`Malicious: ${data.message}`);
                    } else {
                        alert('The file is safe.');
                    }
                })
                .catch(error => {
                    console.error('Error communicating with the server:', error);
                    alert('Error: Unable to communicate with the server.');
                });
        } else {
            alert("Please select a file to scan.");
        }
    });

    // Event listener for scanning a URL
    document.getElementById('scanUrlBtn').addEventListener('click', function() {
        const urlInput = document.getElementById('urlInput').value;
        if (urlInput) {
            checkURL(urlInput);
        } else {
            alert("Please enter a URL to scan.");
        }
    });
});

// Function to check URLs using Google Safe Browsing API
function checkURL(url) {
    const apiKey = process.env.GOOGLE_API_KEY; // Use environment variable
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