document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, phone })
    });
    const data = await response.json();
    document.getElementById('message').textContent = data.message;

    // Poll for status
    const pollStatus = async () => {
      try {
        const statusResponse = await fetch('http://localhost:3000/status');
        const statusData = await statusResponse.json();
        if (statusData.message) {
          document.getElementById('message').textContent = statusData.message;
        } else {
          setTimeout(pollStatus, 1000); // Poll every second
        }
      } catch (error) {
        console.error('Error polling status:', error);
      }
    };
    pollStatus();
  } catch (error) {
    document.getElementById('message').textContent = 'Registration failed';
  }
});
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, phone })
    });
    const data = await response.json();
    document.getElementById('message').textContent = data.message;

    // Poll for status
    const pollStatus = async () => {
      try {
        const statusResponse = await fetch('http://localhost:3000/status');
        const statusData = await statusResponse.json();
        if (statusData.message) {
          document.getElementById('message').textContent = statusData.message;
        } else {
          setTimeout(pollStatus, 1000); // Poll every second
        }
      } catch (error) {
        console.error('Error polling status:', error);
      }
    };
    pollStatus();
  } catch (error) {
    document.getElementById('message').textContent = 'Registration failed';
  }
});
