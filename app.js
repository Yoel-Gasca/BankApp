// implementar un mapa entre las rutas de URL
const routes = {
    '/login': { templateId: 'login', title: 'Inicio de Sesión' },
    '/dashboard': { templateId: 'dashboard', title: 'Tablero' },
    '/404': { templateId: '404', title: 'Página no encontrada' },
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
}
updateRoute('login');

// Función para navegar por la aplicacion
function navigate(path) {
    window.history.pushState({}, '', path);
    updateRoute();
}

// Asegura de que la plantilla mostrada se actualice cuando cambie el historial del navegador
window.onpopstate = () => updateRoute();
updateRoute();