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
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    const formData = new FormData();
    formData.append('file', file);

    console.log("Scanning file:", file.name);

    fetch(`https://www.virustotal.com/api/v3/files`, {
        method: 'POST',
        headers: {
            'x-apikey': apiKey
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log("VirusTotal Response:", data);
            if (data && data.data && data.data.attributes && data.data.attributes.last_analysis_stats) {
                const analysisStats = data.data.attributes.last_analysis_stats;
                if (analysisStats.malicious > 0) {
                    alert("This file contains malware.");
                } else {
                    alert("This file seems safe.");
                }
            } else {
                alert("No analysis results available yet. Try again later.");
            }
        })
        .catch(error => {
            console.error("Error with VirusTotal API:", error);
        });
}