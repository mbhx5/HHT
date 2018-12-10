import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

import { HomePage } from '../home/home';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {


  constructor(public navCtrl: NavController, private inAppBrowser : InAppBrowser ) {

  }

  openWebpage(url: string) {
    
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location : 'no',
      //hidenavigationbuttons : 'yes',
      //hideurlbar : 'yes',
      //toolbarcolor : 'yes',
      //closebuttoncaption : 'Valider'
    }

    // Opening a URL and returning an InAppBrowserObject
    const browser = this.inAppBrowser.create("https://sales.unibro.net/admin/mobile/index.php?id_client=1&id_vendeur=21", '_self', options);

   // Inject scripts, css and more with browser.X
   browser.on('loadstop').subscribe(event => {
      if (event.url.match("close.php")) {
        browser.close();
        this.navCtrl.push(HomePage);
      }

 });
   
  }

}
