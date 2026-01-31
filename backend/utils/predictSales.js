const { exec } = require('child_process');
const path = require('path');

const predictSales = () => {
    return new Promise((resolve, reject) => {
        exec('python sales_prediction_model.py', { cwd: path.join(__dirname, '../python') }, (error, stdout, stderr) => {
            if (error) return reject(error);
            resolve("Prediction Completed");
        });
    });
};

module.exports = predictSales;
