import { tag, template, useShadow } from "slim-js/Decorators";
import { Slim } from "slim-js";

@tag('heart-beat')
@template(/*html*/`

<style>
    @keyframes heartBeat {
    0% {
      transform: scale(1.03);
    }
    6% {
      transform: scale(1.02);
    }
    10% {
      transform: scale(1);
    }
    40% {
      transform: scale(1.03);
    }
    85% {
      transform: scale(1.02);
    }
    90% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.03);
    }
  }

  :host {
    display: inline-block;
    position: relative;
    animation: {{speed}}s infinite heartBeat;
  }
</style>

<slot></slot>

`)
@useShadow(true)
class HeartBeat extends Slim {

  constructor () {
    super()
    this.speed = 1.3;
  }
  
  static get observedAttributes () {
    return ['duration']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    this.speed = newValue;
  }

}