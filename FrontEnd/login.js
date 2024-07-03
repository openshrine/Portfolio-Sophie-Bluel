document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('name').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Mot de passe incorrect');
            }

            const data = await response.json();

            // Save user token or any required information
            localStorage.setItem('user', JSON.stringify(data));

            // Redirect to the homepage
            window.location.href = 'index.html';
        } catch (error) {
            alert(error.message);
        }
    });
});
