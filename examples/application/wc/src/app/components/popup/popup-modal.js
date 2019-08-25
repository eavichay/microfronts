import { tag, template, useShadow } from "slim-js/Decorators";
import { Slim } from "slim-js";

@tag('popup-modal')
@template(require('./popup-modal.template.html'))
@useShadow(true)
class PopupModal extends Slim {

  /* type HTMLElement */ backdrop;

  close () {
    this.style.display = 'none'
    const backdrop = this.find('#backdrop')
    const content = this.find('#content')
    backdrop.style.opacity = content.style.opacity = 0
    content.style.top = null
  }

  open () {
    this.style.display = 'flex'
    setTimeout( () => {
      const backdrop = this.find('#backdrop')
      const content = this.find('.content')
      content.style.opacity = backdrop.style.opacity = 1
      content.style.top = '0'
    }, 10)
  }

}