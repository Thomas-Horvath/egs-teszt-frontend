const url = "https://thomasapi.eu"
// const url = "http://127.0.0.1:9000"
// const url = "https://egs-backend.onrender.com"
const alert = document.querySelector('.succsess-alert');


  document.getElementById('register').addEventListener('submit', async function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      try {
          const response = await fetch(url + "/api/register", {
              method: 'POST',
              body: formData,
              mode: "cors"
          })

          const result = await response.json();
          if (response.ok) {
              alert.innerHTML = `<p>Sikeres regisztráció!</p>`
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