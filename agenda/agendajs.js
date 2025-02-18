// Variables de paginación
let contactos = []; 
let currentPage = 1;
const recordsPerPage = 10;
const maxPagesToShow = 10; 

fetch("http://www.raydelto.org/agenda.php")
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        contactos = data;
        renderTable();
        renderPagination();
    })
    .catch((error) => {
        console.error("Error consuming API: ", error);
        document.querySelector(".table-error-msg").textContent =
            "There was an error loading data. Please try again.";
    });

// Mostrar datos en la tabla
function renderTable() {
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const paginatedContacts = contactos.slice(start, end);

    let body = "";
    paginatedContacts.forEach(contact => {
        body += `<tr><td>${contact.nombre}</td><td>${contact.apellido}</td><td>${contact.telefono}</td></tr>`;
    });

    document.querySelector(".data").innerHTML = body;
}

// Crear paginación con 10 números visibles a la vez
function renderPagination() {
    const totalPages = Math.ceil(contactos.length / recordsPerPage);
    let startPage = Math.floor((currentPage - 1) / maxPagesToShow) * maxPagesToShow + 1;
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    const paginationContainer = document.createElement("div");
    paginationContainer.classList.add("pagination");

    // Botón 'Anterior'
    if (currentPage > 1) {
        const prevButton = createPaginationButton("«", currentPage - 1);
        paginationContainer.appendChild(prevButton);
    }

    // Números de página dinámicos
    for (let i = startPage; i <= endPage; i++) {
        const button = createPaginationButton(i, i);
        if (i === currentPage) button.classList.add("active");
        paginationContainer.appendChild(button);
    }

    // Botón 'Siguiente'
    if (currentPage < totalPages) {
        const nextButton = createPaginationButton("»", currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }

    // Reemplazar la paginación existente
    const existingPagination = document.querySelector(".pagination");
    if (existingPagination) existingPagination.remove();

    document.querySelector(".section-one").appendChild(paginationContainer);
}

// Crear botones de paginación
function createPaginationButton(text, page) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("page-button");
    button.addEventListener("click", () => changePage(page));
    return button;
}

// Cambiar de página
function changePage(page) {
    currentPage = page;
    renderTable();
    renderPagination();
}

//Botón ocultar formulario
function ocultarFormulario() {
  const contenedorFormulario = document.getElementById("contenedor-formulario");
  if (contenedorFormulario.firstChild) {
    contenedorFormulario.innerHTML = ""; // Borra el contenido del div
  }
}

//Generar el formulario al presionar el botón new contact
function mostrarFormulario() {
  const contenedorFormulario = document.getElementById("contenedor-formulario");

  if (document.querySelector(".new-form")) {
    return;
  }

  // Crear el formulario dinámicamente
  const formulario = document.createElement("form");
  formulario.setAttribute("action", "post");
  formulario.classList.add("new-form");
  formulario.innerHTML = `
    <label for="contact-name">Name</label>
    <input name="nombre" type="text" placeholder="Enter name" id="contact-name" />
    <label for="lastname">Lastname</label>
    <input name="apellido" type="text" placeholder="Enter lastname" id="lastname" />
    <label for="phonenumber">Phone number</label>
    <input name="telefono" type="text" placeholder="Enter phone number" id="phonenumber" />
    <button type="submit" class="action-buttons" id="new-button">New Contact</button>
    <button class="action-buttons" type="button" onclick="ocultarFormulario()">Hide form</button>
    
  `;

  // Insertar el formulario en el contenedor
  contenedorFormulario.appendChild(formulario);

  //Obtener datos del formulario generado
  const elementoformulario = document.querySelector(".new-form");

  elementoformulario.addEventListener("submit", (event) => {
    event.preventDefault(); //Esto evita que el navegador recargue la pagina raro

    const datosform = new FormData(elementoformulario);
    const datos = Object.fromEntries(datosform);
    console.log(datos);

    fetch("http://www.raydelto.org/agenda.php", {
      method: "POST",
      body: JSON.stringify(datos),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.text();
      })
      .then((TextoRespuesta) => {
        alert("Your contact has been saved!");
        location.reload(); //recarga la pagina para que se llene la tabla
      })
      .catch((error) => {
        console.error("Error al enviar los datos a la API: ", error);
      });
  });
}
