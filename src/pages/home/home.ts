import { Component, ViewChild } from "@angular/core";
import { NavController, App, AlertController } from "ionic-angular";
import { AuthService } from "../../providers/auth-service";
import { Common } from "../../providers/common";

@Component({ selector: "page-home", templateUrl: "home.html" })

export class HomePage {
  myDate: String = new Date().toISOString();

  item = {};
  itmeobj = {};
  
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getinfovente();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
  
  @ViewChild("updatebox") updatebox;
  public userDetails: any;
  public resposeData: any;
  public dataSet: any;
  public dataSetObjectif: any;
  public noRecords: boolean;
  userPostData = {
    user_id: "",
    token: "",
    feed: "",
    feed_id: "",
    depot: "",
    name: "",
    lastCreated: ""
  };

  constructor(
    public common: Common,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public app: App,
    public authService: AuthService
  ) {
    const data = JSON.parse(localStorage.getItem("userData"));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.id;
    this.userPostData.depot = this.userDetails.depot;
    this.userPostData.token = this.userDetails.token;
    this.dataSet = false;
    this.dataSetObjectif = false ;
    this.noRecords = false;
    //this.getFeed();
    this.getinfovente();
  }
  getinfovente(){
    this.common.presentLoading();
    this.authService.postData(this.userPostData, "details").then(
      result => {
        this.resposeData = result;
        if (this.resposeData.depotData) {
          this.common.closeLoading();
          this.dataSet = this.resposeData.depotData ;
          this.dataSetObjectif = this.resposeData.objectifData ;
          //console.log(this.dataSetObjectif.objectif);
        } else {
          this.common.closeLoading();
          console.log("No access");
        }
      },
      err => {
        //Connection failed message
      }
    );
  }
  getFeed() {
    this.common.presentLoading();
    this.authService.postData(this.userPostData, "feed").then(
      result => {
        this.resposeData = result;
        if (this.resposeData.feedData) {
          this.common.closeLoading();
          this.dataSet = this.resposeData.feedData;
          console.log(this.dataSet);

          const dataLength = this.resposeData.feedData.length;

          this.userPostData.lastCreated = this.resposeData.feedData[
            dataLength - 1
          ].created;
        } else {
          this.common.closeLoading();
          console.log("No access");
        }
      },
      err => {
        //Connection failed message
      }
    );
  }

  feedUpdate() {
    if (this.userPostData.feed) {
      this.common.presentLoading();
      this.authService.postData(this.userPostData, "feedUpdate").then(
        result => {
          this.resposeData = result;
          if (this.resposeData.feedData) {
            this.common.closeLoading();
            this.dataSet.unshift(this.resposeData.feedData);
            this.userPostData.feed = "";

            //this.updatebox.setFocus();
            setTimeout(() => {
              //  this.updatebox.focus();
            }, 150);
          } else {
            this.common.closeLoading();
            console.log("No access");
          }
        },
        err => {
          //Connection failed message
        }
      );
    }
  }

  feedDelete(feed_id, msgIndex) {
    if (feed_id > 0) {
      let alert = this.alertCtrl.create({
        title: "Delete Feed",
        message: "Do you want to buy this feed?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            }
          },
          {
            text: "Delete",
            handler: () => {
              this.userPostData.feed_id = feed_id;
              this.authService.postData(this.userPostData, "feedDelete").then(
                result => {
                  this.resposeData = result;
                  if (this.resposeData.success) {
                    this.dataSet.splice(msgIndex, 1);
                  } else {
                    console.log("No access");
                  }
                },
                err => {
                  //Connection failed message
                }
              );
            }
          }
        ]
      });
      alert.present();
    }
  }



  doInfinite(e): Promise<any> {
    console.log("Begin async operation");
    return new Promise(resolve => {
      setTimeout(() => {
        this.authService.postData(this.userPostData, "feed").then(
          result => {
            this.resposeData = result;
            if (this.resposeData.feedData.length) {
              const newData = this.resposeData.feedData;
              this.userPostData.lastCreated = this.resposeData.feedData[
                newData.length - 1
              ].created;

              for (let i = 0; i < newData.length; i++) {
                this.dataSet.push(newData[i]);
              }
            } else {
              this.noRecords = true;
              console.log("No user updates");
            }
          },
          err => {
            //Connection failed message
          }
        );
        resolve();
      }, 500);
    });
  }

  converTime(time) {
    let a = new Date(time * 1000);
    return a;
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout() {
    //Api Token Logout
    this.common.presentLoading();
    localStorage.clear();
    //setTimeout(() => this.backToWelcome(), 1000);
    this.backToWelcome();
    this.common.closeLoading();
  }
}
