const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: 'https://integrate.api.nvidia.com/v1'
});

const MODEL = 'meta/llama-3.1-8b-instruct';

exports.chat = async (prompt, context = '') => {
    try {
        const completion = await client.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: 'system',
                    content: `You are a public health assistant for a community health surveillance system in India. Keep responses concise and practical for field health workers. ${context}`
                },
                { role: 'user', content: prompt }
            ],
            max_tokens: 500
        });

        return completion.choices[0].message.content;
    } catch (error) {
        throw new Error(`AI service error: ${error.message}`);
    }
};

exports.summarizeReports = async (reports) => {
    try {
        const reportSummary = reports.map(r => 
            `Village: ${r.villageId?.villageName}, Disease: ${r.suspectedDisease}, Affected: ${r.affectedCount}, Symptoms: ${r.symptoms.join(', ')}`
        ).join('\n');

        const completion = await client.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You analyze health surveillance reports and provide brief, actionable summaries.' },
                { role: 'user', content: `Analyze these health reports and summarize in under 200 words with: 1) Situation assessment 2) Main concerns 3) Recommendations.\n\n${reportSummary}` }
            ],
            max_tokens: 400
        });

        return completion.choices[0].message.content;
    } catch (error) {
        throw new Error(`AI service error: ${error.message}`);
    }
};

exports.generateAwareness = async (disease, language = 'english') => {
    try {
        const completion = await client.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You create simple health awareness content for rural communities with low literacy.' },
                { role: 'user', content: `Create a short awareness message about ${disease} in ${language}. Include symptoms, prevention, and when to seek help. Under 150 words.` }
            ],
            max_tokens: 300
        });

        return completion.choices[0].message.content;
    } catch (error) {
        throw new Error(`AI service error: ${error.message}`);
    }
};