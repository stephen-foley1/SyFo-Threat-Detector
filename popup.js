document.addEventListener('DOMContentLoaded', function() {
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
});