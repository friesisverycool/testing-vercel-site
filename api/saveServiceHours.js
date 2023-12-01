module.exports = async (req, res) => {
    try {
        const { body } = req;
        
        const fs = require('fs');
        fs.writeFileSync('./data.json', JSON.stringify(body));

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
