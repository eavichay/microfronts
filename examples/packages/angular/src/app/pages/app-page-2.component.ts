import { Component, OnDestroy } from '@angular/core';
import {IAppContext} from '../../../../../../dist/interfaces';

@Component({
  selector: 'app-page-2-component',
  template: /*html*/`
<div>
  <div>
      <div>
        This is the shared state
      </div>
      <div>
        Current user (readonly):
        <input type="text" disabled="disabled" value="{{sharedState.username}}" />
      </div>
      <div>
        Number of clicks {{sharedState.clicks}}
      </div><button (click)="handleClick()">Click me!</button>
    </div>
</div>
`
})
export class AppPage2Component implements OnDestroy {

  public sharedState: any = window.AppContext.get('nativeState');

  handleClick() {
    this.sharedState.clicks++;
    this.sharedState = this.sharedState;
  }

  ngOnDestroy() {
    console.log('destroyed');
  }
}
