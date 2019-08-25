import { Slim } from 'slim-js'
import { tag, template, useShadow } from 'slim-js/Decorators'

// Slim.js plugin to invoke shady-css on components
import '../helpers/shady-css.js'

import 'slim-js/directives/all.js'

// import custom elements
import './components/header/header.js'
import './components/heart-beat.js'
import './components/background-video.js'
import './components/button-array.js'
import './components/popup/popup-modal.js'
import './components/info-popup.js'

// import styles and templates
import DESKTOP_CSS from './app.desktop.style.html'
import MOBILE_CSS from './app.mobile.style.html'
import APP_TEMPLATE from './app.template.html'
import documentReady from '../helpers/document-ready.js';

// application root custom element
@tag('awesome-app')
@template(`${DESKTOP_CSS}${MOBILE_CSS}${APP_TEMPLATE}}`)
@useShadow(true)
class App extends Slim {

  fadeIn () {
    if (this.animate) {
      this.animate([
        {
          opacity: 0
        },
        {
          opacity: 1
        }
      ], {
        delay: 250,
        duration: 500
      }).onfinish = () => this.style.opacity = null
    } else {
      this.style.opacity = null
    }
  }

  async onCreated () {
    await documentReady()
    this.classList.remove('loading')
    this.style.opacity = 0;
    this.innerHTML = null;
    this.fadeIn()
  }

  redirect (event) {
    const button = event.target
    const url = button.getAttribute('target')
    window.location.href = url
  }

  closeModal () {
    this.modal.close()
  }

  openModal () {
    this.modal.open()
  }
}