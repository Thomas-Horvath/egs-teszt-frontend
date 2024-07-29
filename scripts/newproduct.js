const url = "https://thomasapi.eu"
// const url = "http://127.0.0.1:9000"
// const url = "https://egs-backend.onrender.com"
  document.getElementById('productForm').addEventListener('submit', async function (event) {
      event.preventDefault();
      const formData = new FormData(this);

      const token = sessionStorage.getItem('authToken');
      try {
          const response = await fetch(url + "/api/newproduct", {
              method: 'POST',
              body: formData,
              headers: {
                  "Authorization": "Bearer " + token
              },
              mode: "cors"
          })

          const result = await response.json();
          if (response.ok) {
              console.log('Termék sikeresen hozzáadva');
              setTimeout(() => {
                  window.location.href = '/egs-teszt-frontend//index.html';
              }, 1000);
          } else {
              console.log('Hiba történt: ' + result.message);
          }
      } catch (error) {
          console.log('Hiba történt: ' + error.message);
      }
  });