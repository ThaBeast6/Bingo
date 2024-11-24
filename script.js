const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Function to generate a random Bingo card with "FREE SPACE" in the center
const generateRandomCard = () => {
    const numbers = new Set();
    while (numbers.size < 24) { // Generate 24 numbers, leaving room for the "FREE SPACE"
        numbers.add(Math.floor(Math.random() * 50) + 1);
    }
    const randomNumbers = Array.from(numbers).sort((a, b) => a - b);
    // Insert "FREE SPACE" at the center (index 12)
    randomNumbers.splice(12, 0, 'FREE');
    return randomNumbers;
};

// Function to generate a Bingo card from custom numbers
const generateCustomCard = (customNumbers) => {
    const uniqueNumbers = new Set(customNumbers);
    if (uniqueNumbers.size !== 25) { // Ensure 25 numbers are provided
        return 'Please provide exactly 25 unique numbers.';
    }
    const customCard = Array.from(uniqueNumbers).sort((a, b) => a - b);
    // Insert "FREE SPACE" at the center (index 12)
    customCard.splice(12, 0, 'FREE');
    return customCard;
};

client.on('messageCreate', (message) => {
    if (message.content.startsWith('!bingo')) {
        const args = message.content.split(' ').slice(1);
        
        if (args.length === 0) {
            // Generate random card
            const randomNumbers = generateRandomCard();
            const card = formatCard(randomNumbers);
            message.channel.send(`\`\`\`yaml\n${card}\n\`\`\``); // Code block for better formatting
        } else {
            // Generate custom card
            const customNumbers = args.map(Number);
            const customCard = generateCustomCard(customNumbers);
            if (Array.isArray(customCard)) {
                const card = formatCard(customCard);
                message.channel.send(`\`\`\`yaml\n${card}\n\`\`\`"); // Code block for better formatting
            } else {
                message.channel.send(customCard); // Error message if custom card is invalid
            }
        }
    }
});

// Helper function to format the Bingo card
const formatCard = (numbers) => {
    const rows = [];
    for (let i = 0; i < 5; i++) {
        const row = numbers.slice(i * 5, i * 5 + 5).map(num => num === 'FREE' ? '**FREE**' : num);
        rows.push(`| ${row.join(' | ')} |`);
    }
    return `**Your Bingo Card**\n${rows.join('\n')}`;
};
