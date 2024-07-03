document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();  // Empêche la soumission du formulaire

        const name = document.getElementById('name').value;
        const password = document.getElementById('psswrd').value;

        // Prépare les données de la requête
        const data = {
            email: name,
            password: password
        };

        // Envoie la requête POST à l'API
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.id === 'sophie.bluel@test.tld' && data.token === 'S0phie') {
                    alert('Login successful!');
                    // Redirige vers une autre page ou effectue une autre action
                } else {
                    alert('Erreur dans l’identifiant ou le mot de passe');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Erreur dans l’identifiant ou le mot de passe');
            });
    });
});