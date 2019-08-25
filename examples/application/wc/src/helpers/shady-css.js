if (window.ShadyCSS && window.ShadyCSS.nativeShadow !== true ) {
  Slim.plugin('afterRender', (target) => {
  if (!target._shadycomplete) {
    const content = Slim.root(target).innerHTML
    const template = document.createElement('template')
    template.innerHTML = content
    ShadyCSS.prepareTemplate(template, target.localName)
    ShadyCSS.styleElement(target)
    target._shadycomplete = true
  }})
}