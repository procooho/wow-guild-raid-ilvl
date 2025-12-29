
async function testLogin() {
    try {
        const res = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'AwakenOfficer', password: 'AwOf1234' })
        });

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            console.log('Status:', res.status);
            console.log('Data:', data);
        } catch (e) {
            console.log('Status:', res.status);
            console.log('Response is not JSON:', text.substring(0, 500));
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testLogin();
