export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { message } = req.body;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                max_tokens: 1024,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a basic health assistant. When users describe symptoms, provide: 1. 2-3 possible common causes. 2. Simple wellness tips for each. 3. Always end with exactly this line: ⚠️ I am not a doctor. Please consult a healthcare professional for proper diagnosis. Keep replies friendly, clear and simple. Never suggest specific medicines.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
}