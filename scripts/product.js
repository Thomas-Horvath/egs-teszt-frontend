// const url = "https://thomasapi.eu"
// const url = "http://127.0.0.1:9000"
const url = "https://egs-backend.onrender.com/"
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

function fetchProductDetails(productId) {
    fetch(`${url}/api/product/${productId}`)
        .then(response => response.json())
        .then(data => {
            renderProductDetails(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function renderProductDetails(product) {
    const container = document.querySelector('.product-details');

    let categoryDetails = '';

    if (product.CategoryName === 'Gitár') {
        categoryDetails = `
            <li>Test: ${product.Body}</li>
            <li>Nyak: ${product.Neck}</li>
            <li>Fogólap: ${product.FretBoard}</li>
            <li>Hangszedő kiosztás: ${product.Pickup}</li>
        `;
    } else if (product.CategoryName === 'Erősítő') {
        categoryDetails = `
            <li>Csatornák száma: ${product.ChanelsNumber}</li>
            <li>Hangszórók száma: ${product.SpeakersNumber}</li>
            <li>Teljesítmény: ${product.Wattage} Watt</li>
        `;
    } else if (product.SubCategoryName === 'Gitár kábel') {
        categoryDetails = `
            <li>Kábel hossza: ${product.CableLenght} m</li>
            <li>Csatlakozó típusa: ${product.ConnectorType}</li>
        `;
    } else if (product.CategoryName === 'Kiegészítő') {
        categoryDetails = `
            <li>Szélesség: ${product.Widht} mm</li>
            <li>Hossz: ${product.Lenght} mm</li>
            <li>Vastagság: ${product.Thickness} mm</li>
        `;
    }
    


    const html = `
        <h1>${product.Name}</h1>
        <img src="${product.ProductPhotoURL}" alt="kép"/>
        <p>Ár: ${product.OnSale ? `<del>${product.Price} FT</del> ${product.SalePrice} FT` : `${product.Price} FT`}</p>
        <p>${product.Description}</p>
        <p>Elérhetőség: ${product.InStock ? "Készleten" : "Rendelésre"}</p>
        <p>Márka: ${product.BrandName}</p>
        <ul>
       ${categoryDetails}
        </ul>
        
    `;
    container.innerHTML = html;
}


if (productId) {
    fetchProductDetails(productId);
} else {
    document.querySelector('.product-details').innerHTML = '<p>A termék nem található.</p>';
}