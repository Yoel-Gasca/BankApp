//Variable para almacenar los datos
let account = null;
// Implementar un mapa entre las rutas de URL
const routes = {
    '/login': { templateId: 'login', title: 'Login' },
    '/dashboard': { templateId: 'dashboard', title: 'Dashboard', init: 'updateDashboard' },
    '/404': { templateId: '404', title: 'Page not found' },
    //'/transaction': { templateId: 'transantion', title: 'Transaction'}
};

// Recupere el elemento de plantilla en el DOM
function updateRoute(templateId) {
    const path = window.location.pathname;
    const route = routes [path];
    
    if (!route) {
        return navigate('/');
    }

    // Actualizar el título de la ventana
    document.title = route.title;

    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true); // Clone el elemento de plantilla
    const app = document.getElementById('app'); // Adjúntelo al DOM bajo un elemento visible
    app.innerHTML = '';
    app.appendChild(view);

    // Ejecutar código después de cambiar la plantilla
    if (templateId === 'dashboard') {
        console.log('Se muestra el panel');
    }

    //
    if (typeof route.init === 'function') {
        route.init();
      }
}
updateRoute('login');

// Función para navegar por la aplicacion
function navigate(path) {
    window.history.pushState({}, '', path);
    updateRoute();
}

// ---------------------------------------------------------------------------
// Login/register
// ---------------------------------------------------------------------------

// Funcion asincrona que envia los datos de usuario al servidor
async function createAccount(account) {
    try {
        const response = await fetch('//localhost:5000/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: account
        });
        return await response.json();
    } catch (error) {
        return { error: error.message || 'Unknown error' };
    }
}

// Función del login
async function login() {
    const loginForm = document.getElementById('loginForm')
    const user = loginForm.user.value;
    const data = await getAccount(user);
    if (data.error) {
        return updateElement('loginError', data.error);
    }
    
    account = data;
    navigate('/dashboard');
}

// Función de registro
async function register() {
    const registerForm = document.getElementById('registerForm');
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData);
    const jsonData = JSON.stringify(data);
    const result = await createAccount(jsonData);

    if (result.error) {
        return updateElement('registerError', result.error);
    }

    account = result;
    navigate('/dashboard');
}

// Funcion que actualizará el contenido de texto del elemento DOM con el correspondiente id.
function updateElement(id, text) {
    const element = document.getElementById(id);
    element.textContent = '';
    element.append(textOrNode);
}

// Funcion para recuperar los datos de la cuenta
async function getAccount(user) {
    try {
        const response = await fetch('//localhost:5000/api/accounts/' + encodeURIComponent(user));
        return await response.json();
    } catch (error) {
        return { error: error.message || 'Unknown error' };
    }
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

// Función para completar el marcador de posición:
function updateDashboard() {
    if (!account) {
        return navigate('/login');
    }
  
    updateElement('description', account.description);
    updateElement('balance', account.balance.toFixed(2));
    updateElement('currency', account.currency);

    // Crea un nuevo fragmento DOM en el que podemos trabajar
    const transactionsRows = document.createDocumentFragment();
    for (const transaction of account.transactions) {
        const transactionRow = createTransactionRow(transaction);
        transactionsRows.appendChild(transactionRow);
    }
    updateElement('transactions', transactionsRows);
}

// Función que crea una nueva fila en la tabla y completa su contenido usando datos de transacciones.
function createTransactionRow(transaction) {
    const template = document.getElementById('transaction');
    const transactionRow = template.content.cloneNode(true);
    const tr = transactionRow.querySelector('tr');
    tr.children[0].textContent = transaction.date;
    tr.children[1].textContent = transaction.object;
    tr.children[2].textContent = transaction.amount.toFixed(2);
    return transactionRow;
  }


// Asegura de que la plantilla mostrada se actualice cuando cambie el historial del navegador
window.onpopstate = () => updateRoute();
updateRoute();