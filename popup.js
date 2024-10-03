document.addEventListener('DOMContentLoaded', function() {

    // Event listener for scanning a manually entered URL
    document.getElementById('scanUrlBtn').addEventListener('click', function() {
        const url = document.getElementById('urlInput').value;
        if (url) {
            checkURL(url);  // Your existing URL scanning function
        } else {
            alert("Please enter a valid URL.");
        }
    });

    // Event listener for scanning a manually uploaded file
    document.getElementById('scanFileBtn').addEventListener('click', function() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        if (file) {
            scanFile(file);  // Your existing file scanning function
        } else {
            alert("Please select a file first.");
        }
    });

    // Ensure scanBtn is attached properly
    const scanBtn = document.getElementById('scanBtn');
    if (scanBtn) {
        scanBtn.addEventListener('click', function() {
            const fileInput = document.getElementById('attachment');
            const file = fileInput.files[0];
            if (file) {
                scanFile(file);  // Your scanning function
            } else {
                alert("Please select a file first.");
            }
        });
    } else {
        console.error('Element with id "scanBtn" not found.');
    }
});

// Your existing checkURL function (URL phishing detection)
function checkURL(url) {
    const apiKey = 'AIzaSyBulgcKZpxAAw0QE2Y8a4k7dcN_nxpkACM';
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
            console.log("API Response:", data);  // Log the API response
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

// Your existing scanFile function (Malware detection for files)
function scanFile(file) {
    const apiKey = '6a902f8e8420ce6fac8f7df257593036fb24c4ddc1f51eb3b7c032e0753f7103';
    const formData = new FormData();
    formData.append('file', file);

    fetch(`https://www.virustotal.com/api/v3/files?apikey=${apiKey}`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log("VirusTotal Response:", data);  // Log the response
            if (data.data.attributes.last_analysis_stats.malicious > 0) {
                alert("This file contains malware.");
            } else {
                alert("This file seems safe.");
            }
        })
        .catch(error => {
            console.error("Error with VirusTotal API:", error);
        });
}
