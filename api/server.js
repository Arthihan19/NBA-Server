const app = require('./src/app.js');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Application started on port ', port);
});