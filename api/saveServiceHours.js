// api/saveServiceHours.js
let serviceHoursData = [];

module.exports = (req, res) => {
    if (req.method === 'POST') {
        serviceHoursData = req.body;
        res.status(200).json({ message: 'Data saved successfully' });
    } else if (req.method === 'GET') {
        res.status(200).json(serviceHoursData);
    } else {
        res.status(404).send('Not Found');
    }
};
