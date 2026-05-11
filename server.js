const express = require("express");

const app = express();

app.use(express.json());

const LOG_WEBHOOK = process.env.LOG_WEBHOOK;
const PMS_WEBHOOK = process.env.PMS_WEBHOOK;

async function sendWebhook(url, body) {

    if (!url) {
        return false;
    }

    try {

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        return response.ok;

    } catch (err) {

        console.log(err);
        return false;

    }
}

app.get("/", (req, res) => {

    res.send("Webhook Proxy Online");

});

app.post("/logs", async (req, res) => {

    const success = await sendWebhook(
        LOG_WEBHOOK,
        req.body
    );

    if (success) {
        return res.sendStatus(200);
    }

    res.sendStatus(500);

});

app.post("/pms", async (req, res) => {

    const success = await sendWebhook(
        PMS_WEBHOOK,
        req.body
    );

    if (success) {
        return res.sendStatus(200);
    }

    res.sendStatus(500);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Proxy running on port ${PORT}`
    );

});
