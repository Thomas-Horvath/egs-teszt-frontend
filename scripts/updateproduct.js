const url = "https://thomasapi.eu"
// const url = "http://127.0.0.1:9000"
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');


document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(url + `/api/product/${productId}`);
    const product = await response.json();

    document.getElementById('name').value = product.Name;
    document.getElementById('modell').value = product.Modell;
    document.getElementById('color').value = product.Color;
    document.getElementById('quality').value = product.Quality;
    document.getElementById('bundsNumber').value = product.BundsNumber;
    document.getElementById('body').value = product.Body;
    document.getElementById('neck').value = product.Neck;
    document.getElementById('fretBoard').value = product.FretBoard;
    document.getElementById('pickup').value = product.Pickup;
    document.getElementById('weight').value = product.Weight;
    document.getElementById('chanelsNumber').value = product.ChanelsNumber;
    document.getElementById('speakersNumber').value = product.SpeakersNumber;
    document.getElementById('wattage').value = product.Wattage;
    document.getElementById('widht').value = product.Widht;
    document.getElementById('lenght').value = product.Lenght;
    document.getElementById('thickness').value = product.Thickness;
    document.getElementById('cableLenght').value = product.CableLenght;
    document.getElementById('connectorType').value = product.ConnectorType;
    document.getElementById('radius').value = product.Radius;
    document.getElementById('categoryName').value = product.CategoryName;
    document.getElementById('subCategoryName').value = product.SubCategoryName;
    document.getElementById('brandName').value = product.BrandName;
    document.getElementById('price').value = product.Price;
    document.getElementById('description').value = product.Description;
    document.getElementById('onSale').checked = product.OnSale;
    document.getElementById('salePrice').value = product.SalePrice;
    document.getElementById('isStock').checked = product.IsStock;
});

document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem('authToken');
    const formData = new FormData(event.target);
    // Checkboxok értékének átalakítása
    const onSale = document.getElementById('onSale').checked;
    const isStock = document.getElementById('isStock').checked;

    // Átalakítjuk a checkboxokat boolean értékekre
    formData.set('OnSale', onSale);
    formData.set('IsStock', isStock);

    const response = await fetch(url + `/api/product/${productId}`, {
        method: 'PUT',
        body: formData,
        headers: {
            "Authorization": "Bearer " + token
        },
        mode: "cors"
    });

    if (response.ok) {
        console.log('A termék sikeresen frissítve!');
    } else {
        console.log('Hiba történt a termék frissítése során.');
    }
});