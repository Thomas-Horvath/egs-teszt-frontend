const url = "https://thomasapi.eu"
// const url = "http://127.0.0.1:9000"
// const url = "https://egs-backend.onrender.com"
const profile = document.querySelector('.userProfil')

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