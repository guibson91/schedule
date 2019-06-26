import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'header-app',
  templateUrl: './header-app.component.html',
  styleUrls: ['./header-app.component.scss'],
})
export class HeaderAppComponent implements OnInit {

  @Input() title?: string;

  @Input() showToday?: boolean = false;

  constructor(public modalCtrl: ModalController, public shared: SharedService) {

  }

  ngOnInit() {

  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  updateToday() {
    this.shared.nowSubject$.next();
  }

}