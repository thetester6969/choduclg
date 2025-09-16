const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

app.get('/up', (req, res) => {
    async function sendPostRequest(url, data) {
        try {
            const response = await axios.post(url || "https://api.ljmash.xyz/api/match/update", data, {
                headers: {
                    'accept': '*/*',
                    'accept-language': 'en-IN,en-US;q=0.9,en-GB;q=0.8,en;q=0.7,gu;q=0.6',
                    'content-type': 'application/json',
                    'origin': 'https://ljmash.xyz',
                    'priority': 'u=1, i',
                    'referer': 'https://ljmash.xyz/',
                    'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
                }
            });

            console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending POST request:', error);
            throw error;
        }
    }

    // Example usage with the data from your curl command
    const apiUrl = 'https://api.ljmash.xyz/api/match/update';
    const requestData = {
        "id1": "987",
        "id2": "332"
    };

    // Send the POST request
    sendPostRequest(apiUrl, requestData)
        .then(response => {
            console.log('Success:', response);
        })
        .catch(error => {
            console.error('Failed:', error);
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Function to send POST request with all required headers using axios
