document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('scanUrlBtn').addEventListener('click', function() {
        const url = document.getElementById('urlInput').value;
        if (url) {
            checkURL(url);
        } else {
            alert("Please enter a valid URL.");
        }
    });

    document.getElementById('scanFileBtn').addEventListener('click', function() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        if (file) {
            scanFile(file);
        } else {
            alert("Please select a file first.");
        }
    });

    const scanBtn = document.getElementById('scanBtn');
    if (scanBtn) {
        scanBtn.addEventListener('click', function() {
            const fileInput = document.getElementById('attachment');
            const file = fileInput.files[0];
            if (file) {
                scanFile(file);
            } else {
                alert("Please select a file first.");
            }
        });
    } else {
        console.error('Element with id "scanBtn" not found.');
    }
});

function checkURL(url) {
    const apiKey = process.env.GOOGLE_API_KEY;
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
            console.log("API Response:", data);
            if (data.matches) {
                alert("Warning! This link may be a phishing site.");
            } else {
                alert("This URL seems safe.");
            }
        })
        .catch(error => {
            console.error("Error with Google Safe Browsing API:", error);
        });
}

function scanFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    // Update the URL to point to your proxy server
    fetch(`http://ec2-16-171-21-198.eu-north-1.compute.amazonaws.com:3000/scan`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from your proxy server
            console.log(data);
        })
        .catch(error => {
            console.error("Error with proxy server:", error);
        });
}
