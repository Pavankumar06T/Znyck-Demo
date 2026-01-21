const fetch = require('node-fetch');

async function checkApi() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/transactions');
        const data = await response.json();

        console.log(`HTTP Status: ${response.status}`);
        console.log(`Total Transactions: ${data.length}`);

        if (data.length > 0) {
            console.log('\nSample Transaction (First Item):');
            const tx = data[0];
            console.log(JSON.stringify(tx, null, 2));

            console.log('\nApplication Field Type:', typeof tx.application);
            console.log('Application value:', tx.application);
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

checkApi();
