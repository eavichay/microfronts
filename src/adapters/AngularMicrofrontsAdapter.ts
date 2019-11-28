window.history.pushState = window.history.replaceState = (state: any, title: string, path: string) => {
    window.location.hash = path;
};
window.addEventListener('hashchange', e => {
    e.preventDefault();
    e.stopPropagation();
})
window.addEventListener('popstate', e => {
    e.preventDefault();
    e.stopPropagation();
});