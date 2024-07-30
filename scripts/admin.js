const url = "https://thomasapi.eu"
// const url = "http://127.0.0.1:9000"
// const url = "https://egs-backend.onrender.com"
const profile = document.querySelector('.adminProfil')
const usersList = document.querySelector('.users')

function fetchProfile(data) {
    const token = sessionStorage.getItem('authToken');
    fetch(url + "/api/profile", {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token
        },
        mode: "cors"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Válasz státusz nem jó. Hiba kód: ' + response.status);
            }
            return response.json();
        })

        .then((data) => {
            console.log(data)
            const userData = `
         <h1>Saját adatok</h1>
         <p>Felhasználónév: ${data.UserName}</p>
         <p>Teljes név: ${data.LastName} ${data.FirstName}</p>
         <p>Email cím: ${data.EmailAddress}</p>
         <p>Telefonszám: ${data.PhoneNumber}</p>
         `;

            profile.innerHTML = userData;
        })
        .catch(error => {
            console.error('Hiba:', error);
        });
}

fetchProfile()

function fetchUsers(data) {
    const token = sessionStorage.getItem('authToken');
    fetch(url + "/api/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token
        },
        mode: "cors"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Válasz státusz nem jó. Hiba kód: ' + response.status);
            }
            return response.json();
        })

        .then((data) => {
            console.log(data)
            let usersData = "<h1>Össze felhasználó:</h1>"
            usersData += data.map(user => `
        
            <h2>${user.UserID}</h2>
         <p>Felhasználónév: ${user.UserName}</p>
         <p>Teljes név: ${user.LastName} ${user.FirstName}</p>
         <p>Email cím: ${user.EmailAddress}</p>
         <p>Telefonszám: ${user.PhoneNumber}</p>
         `
            ).join(" ")

            console.log(usersData)
            usersList.innerHTML = usersData;
        })
        .catch(error => {
            console.error('Hiba:', error);
        });
}

fetchUsers()