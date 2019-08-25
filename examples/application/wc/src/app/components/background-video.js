import { tag, template, useShadow } from "slim-js/Decorators";
import { Slim } from "slim-js";

@tag('background-video')
@template(/*html*/`
<style>
  :host {
    position: absolute;
    left: 50%;
    top: 0;
    width: 100%;
    transform: translate3d(-50%, 0, 0);
    z-index: -1;
  }
  video {
    width: 100%;
    height: auto;
  }
</style>
<video id="background-video" bind:src="src" type="video/mp4" autoplay loop></video>
`)
@useShadow(true)
class BackgroundVideo extends Slim {
  static get observedAttributes () {
    return ['src']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    this.src = newValue
  }
}