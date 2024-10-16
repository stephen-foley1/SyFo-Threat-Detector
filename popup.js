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

            fetch('http://ec2-16-171-21-198.eu-north-1.compute.amazonaws.com:3000/scan', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);
                    alert('Scan result received. Check console for details.');
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

                fetch('http://ec2-16-171-21-198.eu-north-1.compute.amazonaws.com:3000/scan', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Response from server via scanBtn:', data);
                        alert('Scan result received. Check console for details.');
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
