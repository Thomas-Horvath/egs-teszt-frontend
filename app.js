const url = "https://thomasapi.eu"
// const url = "http://127.0.0.1:9000"
const form = document.querySelector('.login-form');

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
            fetchOrder(data);
            fetchProfile(data)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

};

form.addEventListener('submit', handleFormSubmit);










function fetchProducsts() {
    fetch(url + "/api/products")
        .then(response => response.json())
        .then(data => {
            render(data)
        })
}

fetchProducsts()


const container = document.querySelector('.container');
function render(data) {

    // Szűrjük ki azokat a termékeket, amelyek OnSale értéke true
    // const onSaleProducts = data.filter(x => x.OnSale);


    // const hmtl = onSaleProducts.map((x) => `
    const hmtl = data.map((x) => `
    <div class="card js-card" ${x.OnSale ? `style='background: tomato'` : '' } data-product-id=${x.ProductID}>
    <p>${x.ProductID}</p>
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
            window.location.href = `/product.html?id=${productId}`;
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
            } else {
                let html = '<h1>Admin Felület</h1><h2>Felhasználók:</h2>';
                const userList = data.map((user) => `<p>${user.UserName} , ${user.EmailAddress}</p>`).join('');
                html += userList;
                users.innerHTML = html;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


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
            console.log('saját profil:', data)

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

