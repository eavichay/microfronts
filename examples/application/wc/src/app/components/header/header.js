import { tag, template, useShadow } from "slim-js/Decorators";
import { Slim } from "slim-js";

@tag('app-header')
@template(require('./header.template.html'))
@useShadow(true)
class AppHeader extends Slim {
}