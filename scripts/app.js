const url = "https://thomasapi.eu"
// const url = "http://127.0.0.1:9000"
// const url = "https://egs-backend.onrender.com"
const form = document.querySelector('.login-form');
const logOutButton = document.querySelector('.logoutButton');
const container = document.querySelector('.container');
const users = document.querySelector('.users');
const adminName = document.querySelector('.adminName');
const newProductBtn = document.querySelector('.js-newproduct-btn');
;
let productsData = [];
users.innerHTML = "";



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
                fetchProfile(data);
                form.user.value = "";
                form.password.value = "";
            } else {
                console.error('Login failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Hiba:', error);
        });

};



function handleLogout() {
    sessionStorage.removeItem('authToken');
    document.querySelector('.users').innerHTML = "";
    document.querySelector('.adminName').innerHTML = "";
    fetchProductsLogOut();
    newProductBtn.classList.remove('active');
}




function fetchProductsLogOut() {
    fetch(url + "/api/products")
        .then(response => response.json())
        .then(data => {
            productsData = data;
            render(productsData)
        })
}
function fetchProductsAdmin() {
    const token = sessionStorage.getItem('authToken');
    fetch(url + "/api/products", {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token,
        },
        mode: "cors"
    })
        .then(response => response.json())
        .then(data => {
            productsData = data;
            renderAdmin(productsData)
        })
}



function render(data) {


    const hmtl = data.map((x) => `
    <div class="card js-card" ${x.OnSale ? `style='background: tomato'` : ''}>
    <img src=${x.ProductPhotoURL} alt="kép"/>
    <p>${x.Name} </p>
    <p>${x.OnSale ? `<del>${x.Price} FT</del> ${x.SalePrice} FT` : `${x.Price} FT`}</p>
    <p style="${x.InStock ? 'color: green' : 'color: red'}">${x.InStock ? "Készleten" : "Rendelésre"} </p>
    <button class="btn details-btn" data-product-id=${x.ProductID}>Részletek</button>
    </div>
    `);
    container.innerHTML = hmtl.join('');


    const cards = document.querySelectorAll('.details-btn');
    // Kattintási esemény hozzárendelése minden kártyához
    cards.forEach(card => {
        card.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-product-id');
            window.location.href = `./product.html?id=${productId}`;
        });
    });

}



function renderAdmin(data) {

    const hmtl = data.map((x) => `
    <div class="card js-card" ${x.OnSale ? `style='background: tomato'` : ''}>
    <img src=${x.ProductPhotoURL} alt="kép"/>
    <p>${x.Name} </p>
    <p>${x.OnSale ? `<del>${x.Price} FT</del> ${x.SalePrice} FT` : `${x.Price} FT`}</p>
    <p style="${x.InStock ? 'color: green' : 'color: red'}">${x.InStock ? "Készleten" : "Rendelésre"} </p>
    <button class="btn details-btn" data-product-id=${x.ProductID}>Részletek</button>
    <button class="btn update-btn" data-update-id=${x.ProductID}>Frissítés</button>
    <button class="btn delete-btn" data-delete-id=${x.ProductID}>Törlés</button>
    </div>
    `);
    container.innerHTML = hmtl.join('');


    const cards = document.querySelectorAll('.details-btn');
    // Kattintási esemény hozzárendelése minden kártyához
    cards.forEach(card => {
        card.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-product-id');
            window.location.href = `./product.html?id=${productId}`;
        });
    });

    const update = document.querySelectorAll('.update-btn');
    // Kattintási esemény hozzárendelése minden kártyához
    update.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-update-id');
            window.location.href = `./update.html?id=${productId}`;
        });
    });
    const deleteBtns = document.querySelectorAll('.delete-btn');
    // Kattintási esemény hozzárendelése minden kártyához
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-delete-id');
            console.log(productId);
            // Használjuk a confirm()-ot az OK/Mégsem választáshoz
            const userConfirmed = confirm("Biztosan törölni szeretnéd?");

            if (userConfirmed) {
                // Ha az OK gombot nyomták meg, végrehajtjuk a törlést
                deleteFetch(productId);
            } else {
                // Ha a Mégsem gombot nyomták meg, nem csinálunk semmit
                console.log('Törlés megszakítva');
            }
        });
    });
}

function deleteFetch(productId) {
    const token = sessionStorage.getItem('authToken');
    productId = productId;
    fetch(url + `/api/product/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token
        },
        mode: "cors"
    })
        .then(response => {
            return response.json()
        })
        .then(res => {
            console.log(res);
            fetchProductsAdmin();
        })
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
                throw new Error('Válasz státusz nem jó. Hiba kód: ' + response.status);
            }
            return response.json();
        })

        .then((data) => {
            users.innerHTML = "";
            if (data.IsAdmin === false) {
                users.innerHTML = `<h1>Vásárlói felület</h1><p>Felhasználó: ${data.UserName}</p>`;
                newProductBtn.classList.remove('active');
            } else {
                users.innerHTML = `<h1>Admin felület</h1><p>Felhasználó: ${data.UserName}</p>`;
                newProductBtn.classList.add('active');
                fetchProductsAdmin();
            }
        })

        .catch(error => {
            console.error('Hiba:', error);
        });
}










form.addEventListener('submit', handleFormSubmit);


// Kijelentkezési gomb eseménykezelőjének hozzárendelése
logOutButton.addEventListener('click', handleLogout);

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        fetchProfile({ token: token });
    }
});


fetchProductsLogOut()