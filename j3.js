
const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

// Serve HTML page with button
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Trigger POST Request</title>
        </head>
        <body>
            <label>id1: <input type="number" id="id1" value="987"></label><br>
            <label>id2: <input type="number" id="id2" value="332"></label><br>
            <button id="triggerBtn">Send POST Request</button>
            <button id="infiniteBtn">Infinite</button>
            <button id="stopBtn" disabled>Stop</button>
            <div id="result"></div>
            <script>
                let intervalId = null;
                document.getElementById('triggerBtn').onclick = async function() {
                    document.getElementById('result').innerText = 'Sending...';
                    const id1 = document.getElementById('id1').value;
                    const id2 = document.getElementById('id2').value;
                    try {
                        const res = await fetch('/trigger', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id1, id2 })
                        });
                        const data = await res.json();
                        document.getElementById('result').innerText = 'Success: ' + JSON.stringify(data);
                    } catch (err) {
                        document.getElementById('result').innerText = 'Failed: ' + err;
                    }
                };

                document.getElementById('infiniteBtn').onclick = function() {
                    if (intervalId) return;
                    document.getElementById('result').innerText = 'Started infinite requests...';
                    document.getElementById('stopBtn').disabled = false;
                    intervalId = setInterval(async () => {
                        const id1 = document.getElementById('id1').value;
                        const id2 = document.getElementById('id2').value;
                        try {
                            const res = await fetch('/trigger', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id1, id2 })
                            });
                            const data = await res.json();
                            document.getElementById('result').innerText = 'Success: ' + JSON.stringify(data);
                        } catch (err) {
                            document.getElementById('result').innerText = 'Failed: ' + err;
                        }
                    }, 1000);
                };

                document.getElementById('stopBtn').onclick = function() {
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                        document.getElementById('result').innerText = 'Stopped.';
                        document.getElementById('stopBtn').disabled = true;
                    }
                };
            </script>
        </body>
        </html>
    `);
});

// POST endpoint to trigger sendPostRequest
app.post('/trigger', async (req, res) => {
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
    const apiUrl = 'https://api.ljmash.xyz/api/match/update';
    const { id1, id2 } = req.body;
    const requestData = {
        id1: id1,
        id2: id2
    };
    try {
        const result = await sendPostRequest(apiUrl, requestData);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Function to send POST request with all required headers using axios
