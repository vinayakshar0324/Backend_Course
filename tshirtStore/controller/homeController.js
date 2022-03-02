const bigPromise = require('../middlewares/bigPromise');



exports.home = (req, res) => {
    res.status(200).json({
        success: true,
        greeting: 'hello from api'
    });
};