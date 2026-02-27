import fs from 'fs';

async function trigger() {
    const url = "https://qvvotmrwkiqhrzzbroqp.supabase.co/functions/v1/kirvano-webhook";
    const key = "sb_publishable_PmAafPnODJVKise5L5joDA_TiBtn4JW";

    const payload = {
        event: "SALE_APPROVED",
        customer: {
            email: "helenacamposvmm@gmail.com",
            name: "Helena Campos (Owner)"
        },
        products: [
            { id: "59a5b1d0-fc5a-4ae2-b77b-95fa30b0657c" } // Vitalício
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': key,
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        fs.writeFileSync('webhook_response.json', JSON.stringify(data, null, 2));
        console.log("Done. Check webhook_response.json");
    } catch (error) {
        console.error("Error:", error.message);
    }
}

trigger();
