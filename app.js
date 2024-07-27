const url = "https://thomasapi.eu"
const form = document.querySelector('.login-form');

function handleFormSubmit(event) {
    event.preventDefault(); // Megakadályozza az űrlap alapértelmezett elküldését

    // Az űrlap elemek lekérése
    const form = event.target;
    const user = form.user.value;
    const password = form.password.value;

    fetch(url+"/api/login", {
        method: "POST",
        body: JSON.stringify({
            UserName: user,
            Password: password
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        mode: "cors"
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            fetchOrder(data);
            fetchProfile(data)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

};

form.addEventListener('submit', handleFormSubmit);










function fetchProducsts() {
    fetch(url+"/api/products")
        .then(response => response.json())
        .then(data => {
            render(data)
        })
}

fetchProducsts()


const container = document.querySelector('.container');
function render(data) {
    const hmtl = data.map((x) => `
    <div class="card">
    <img src=${x.ProductPhotoURL} alt="kép"/>
    <p>${x.Name}</p>
    <p>${x.Price} FT</p>
    </div>
    `);
    container.innerHTML = hmtl.join('');
}

const users = document.querySelector('.users');
function fetchOrder(data) {
    fetch(url+"/api/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + data.token
        },
        mode: "cors"
    })
        .then(response => {
            return response.json().then(data => {
                return {data , status :response.status}
            }) 
        })
        .then(({data , status }) => {
            if (status === 403) {
                users.innerHTML = `<p>${data.message}</p>`;
            } else {
            users.innerHTML = data.map((user) => `<p>${user.UserName} , ${user.EmailAddress}</p>`).join('')
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


function fetchProfile(data) {
    fetch(url+"/api/profile", {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + data.token
        },
        mode: "cors"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('saját profil:', data)

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}