import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public ref: ChangeDetectorRef) { }

  change() {
    this.ref.detectChanges();
  }

}