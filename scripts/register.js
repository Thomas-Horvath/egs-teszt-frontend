const url = "https://thomasapi.eu"
// const url = "http://127.0.0.1:9000"
// const url = "https://egs-backend.onrender.com"
const alert = document.querySelector('.success-alert');


document.getElementById('register').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const lastname = document.getElementById('lastname').value;
    const firstname = document.getElementById('firstname').value;

    const data = {
        UserName: username,
        Password: password,
        EmailAddress: email,
        LastName: lastname,
        FirstName: firstname
    };

    try {
        const response = await fetch(url + "/api/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: "cors"
        })

        const result = await response.json();
        if (response.ok) {
            alert.innerHTML = `<p>Sikeres regisztráció!</p>`
            setTimeout(() => {
                window.location.href = '/egs-teszt-frontend/index.html';
            }, 1000);
        } else {
            console.log('Hiba történt: ' + result.message);
        }
    } catch (error) {
        console.log('Hiba történt: ' + error.message);
    }
});