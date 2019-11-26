window.history.pushState = window.history.replaceState = () => {};
window.addEventListener('popstate', e => {
    e.preventDefault();
    e.stopPropagation();
});