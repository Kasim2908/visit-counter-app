const express = require("express");
const os = require("os");

const app = express();
const PORT = 3000;

let visitCount = 0;

app.get("/", (req, res) => {
    visitCount++;

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Visit Counter App</title>
        <style>
            body {
                background-color: #0f172a;
                color: white;
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }

            .card {
                background: #1e293b;
                padding: 40px;
                border-radius: 16px;
                text-align: center;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                width: 400px;
            }

            h1 {
                color: #38bdf8;
            }

            .count {
                font-size: 48px;
                margin: 20px 0;
                color: #22c55e;
            }

            .info {
                margin-top: 20px;
                color: #cbd5e1;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>🚀 DevSecOps Visit Counter</h1>

            <div class="count">
                ${visitCount}
            </div>

            <p>Total Page Visits</p>

            <div class="info">
                <p><strong>Hostname:</strong> ${os.hostname()}</p>
                <p><strong>Uptime:</strong> ${Math.floor(process.uptime())} seconds</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime()
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});