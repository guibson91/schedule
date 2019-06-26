import * as firebase from "firebase"

import { CalendarComponent } from 'ionic2-calendar/calendar';
import { MonthViewComponent } from 'ionic2-calendar/monthview';
import { WeekViewComponent } from 'ionic2-calendar/weekview';
import { DayViewComponent } from 'ionic2-calendar/dayview';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export const firebaseConfig = {
  apiKey: "AIzaSyBLuN8JMcQh9jte1T3l6IypUpBaptQRmJw",
  authDomain: "schedule-5f143.firebaseapp.com",
  databaseURL: "https://schedule-5f143.firebaseio.com",
  projectId: "schedule-5f143",
  storageBucket: "schedule-5f143.appspot.com",
  messagingSenderId: "962771771833",
  appId: "1:962771771833:web:8235051cf9b05b38"
};

firebase.initializeApp(firebaseConfig);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));