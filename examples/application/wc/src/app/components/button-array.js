import { tag, template, useShadow } from "slim-js/Decorators";
import { Slim } from "slim-js";

@tag('button-array')
@template(/*html*/`

<style>
  @media (max-width: 959px) {
    :host {
      display: inline-flex;
      flex-direction: column;
      justify-content: space-evenly;
      height: 8rem;
      align-items: center;
    }
  }

  @media (min-width: 960px) {
    :host {
      display: inline-flex;
      flex-direction: row;
      justify-content: space-evenly;
    }
  }
</style>
<slot></slot>
`)
@useShadow(true)
class ButtonArray extends Slim {

}