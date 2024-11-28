document.addEventListener('DOMContentLoaded', function() {
    const fileUploadBtn = document.getElementById('fileUploadBtn');
    const scanFileBtn = document.getElementById('scanFileBtn');
    const fileInput = document.getElementById('fileInput');
    const uploadMessage = document.getElementById('uploadMessage');

    if (fileUploadBtn && fileInput) {
        fileUploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }

    if (scanFileBtn && fileInput) {
        scanFileBtn.addEventListener('click', function() {
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
                        console.log('Server Response:', data);
                        if (data.malicious) {
                            alert(`Malicious: ${data.message}`);
                        } else {
                            alert('The file is safe.');
                        }
                        uploadMessage.textContent = 'File uploaded successfully.';
                        fileUploadBtn.textContent = 'File Uploaded';
                        fileInput.value = '';

                        // Upload the logo images
                        uploadLogoImages();
                    })
                    .catch(error => {
                        console.error('Error communicating with the server:', error);
                        alert('Error: Unable to communicate with the server.');
                    });
            } else {
                alert("Please select a file to scan.");
            }
        });
    }

    document.getElementById('scanUrlBtn').addEventListener('click', function() {
        const urlInput = document.getElementById('urlInput').value;
        if (urlInput) {
            checkURL(urlInput);
        } else {
            alert("Please enter a URL to scan.");
        }
    });
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
            console.log('API Response:', data);
            if (data.matches) {
                alert("Warning! This link may be a phishing site.");
            } else {
                alert("This URL seems safe.");
            }

            // Upload the logo images
            uploadLogoImages();
        })
        .catch(error => {
            console.error('Error with Google Safe Browsing API:', error);
            alert('Error: Unable to check URL.');
        });
}

function uploadLogoImages() {
    const logoImages = ['styles/banner.png', 'styles/default_logo.png'];
    logoImages.forEach(imagePath => {
        fetch(imagePath)
            .then(response => response.blob())
            .then(blob => {
                const formData = new FormData();
                formData.append('image', blob, imagePath);

                fetch('http://167.99.200.62:3000/upload', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Logo Image Upload Response:', data);
                    })
                    .catch(error => {
                        console.error('Error uploading logo image:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching logo image:', error);
            });
    });
}