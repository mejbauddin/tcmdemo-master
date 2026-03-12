import axios from 'axios';

async function testRegister() {
    const testData = {
        username: 'testuser_' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123'
    };
    
    console.log('📝 Testing registration with:', testData);
    
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', testData);
        console.log('✅ Success!');
        console.log('Response:', response.data);
    } catch (error) {
        console.log('❌ Failed!');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testRegister();