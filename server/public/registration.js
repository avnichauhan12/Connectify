document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const formData = new FormData(registrationForm);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        // Perform validation (you can add your validation logic here)

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => {
            if (response.ok) {
                console.log('Registration successful');
                // Redirect to login page or show success message
            } else {
                console.error('Registration failed');
                // Handle error response
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
