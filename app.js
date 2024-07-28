const url = "https://thomasapi.eu"
// const url = "http://127.0.0.1:9000"
const form = document.querySelector('.login-form');

let productsData = [];


function handleFormSubmit(event) {
    event.preventDefault(); // Megakadályozza az űrlap alapértelmezett elküldését

    // Az űrlap elemek lekérése
    const form = event.target;
    const user = form.user.value;
    const password = form.password.value;

    fetch(url + "/api/login", {
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
            if (data.token) {
                sessionStorage.setItem('authToken', data.token);
                fetchOrder(data);
                fetchProfile(data);
                form.user.value = "";
                form.password.value = "";
            } else {
                console.error('Login failed:', data.message);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

};



form.addEventListener('submit', handleFormSubmit);




function handleLogout() {
    sessionStorage.removeItem('authToken');
    document.querySelector('.users').innerHTML = "";
    document.querySelector('.adminName').innerHTML = "";
}



// Kijelentkezési gomb eseménykezelőjének hozzárendelése
document.querySelector('.logoutButton').addEventListener('click', handleLogout);

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        fetchOrder({ token: token });
        fetchProfile({ token: token });
    }
});







function fetchProducsts() {
    fetch(url + "/api/products")
        .then(response => response.json())
        .then(data => {
           productsData = data;
           render(productsData)
        })
}

fetchProducsts() 


const container = document.querySelector('.container');
function render(data) {
    
    // Szűrjük ki azokat a termékeket, amelyek OnSale értéke true
    // const onSaleProducts = data.filter(x => x.OnSale);
    
    // <p>${x.ProductID}</p>

    // const hmtl = onSaleProducts.map((x) => `
    const hmtl = data.map((x) => `
    <div class="card js-card" ${x.OnSale ? `style='background: tomato'` : ''} data-product-id=${x.ProductID}>
    <img src=${x.ProductPhotoURL} alt="kép"/>
    <p>${x.Name} </p>
    <p>${x.OnSale ? `<del>${x.Price} FT</del> ${x.SalePrice} FT` : `${x.Price} FT`}</p>
    <p style="${x.InStock ? 'color: green' : 'color: red'}">${x.InStock ? "Készleten" : "Rendelésre"} </p>
    </div>
    `);
    container.innerHTML = hmtl.join('');

    // Kattintási esemény hozzárendelése minden kártyához
    document.querySelectorAll('.js-card').forEach(card => {
        card.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-product-id');
            window.location.href = `./product.html?id=${productId}`;
        });
    });
}

const users = document.querySelector('.users');
function fetchOrder(data) {
    fetch(url + "/api/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + data.token
        },
        mode: "cors"
    })
        .then(response => {
            return response.json().then(data => {
                return { data, status: response.status }
            })
        })
        .then(({ data, status }) => {
            if (status === 403) {
                users.innerHTML = `<h1>Admin felület</h1><p>${data.message}</p>`;
                setTimeout(() => { users.innerHTML = ""; adminName.innerHTML = "" }, 2000);
            } else {
                let html = '<h2>Admin Felület</h2><h3>Felhasználók:</h3>';
                const userList = data.map((user) => `<p>${user.UserName} , ${user.EmailAddress}</p>`).join('');
                html += userList;
                users.innerHTML = html;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

const adminName = document.querySelector('.adminName');
function fetchProfile(data) {
    fetch(url + "/api/profile", {
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

            let profile = `<h1>Bejelentkezett admin: ${data.LastName + ' ' + data.FirstName}</h1>`;
            adminName.innerHTML = profile;

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

