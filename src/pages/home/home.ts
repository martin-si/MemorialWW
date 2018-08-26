import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('Slides') slides: Slides;

  constructor(public navCtrl: NavController, public http: Http /*,  public http: Http*/) {
    this.researchName();
    this.showList = true;
    
  //  this.http.get('data/data.json').subscribe(data => {
   // this.search = data.json();
   // });
  
  }

  auto = false;
  indexOfCurrentFighter = null;
  search = "";
  figtherDisplayed = new Array();
  allFighter = new Array();
  selectedFighter = null;
  showList = true;
  isChangeAuto = null;
  
  
  beginWith(fighter){
    //we could have use regex but I don  t have time to search for it :D
    if(fighter.firstName.length >= this.search.length && fighter.firstName.toUpperCase().substring(0,this.search.length) == this.search.toUpperCase() ){
      return true;
    }
    if(fighter.lastName.length >= this.search.length && fighter.lastName.toUpperCase().substring(0,this.search.length) == this.search.toUpperCase() ){
      return true;
    }
    return false;

  }

  researchName(){
    //cleaning the array
    this.showList = true;
    this.figtherDisplayed = [];
    this.allFighter = [] ;   
    let path = 'assets/data.json';
    let encodedPath = encodeURI(path);
    let timeoutMS = 10000;
    //var rgxp = new RegExp(this.search.toUpperCase()+".*", "g");
    /*$http.get('data/data.json').subscribe(data => {
     this.search = data.json();
    });
    console.log("%o" , this.search);*/
    this.http.get(encodedPath)
    .timeout(timeoutMS)
    .map(res => res.json()).subscribe(data => {
        let responseData = data;
        console.log(responseData);
        for (let i = 0; i < responseData.length; i++) {
          if(this.beginWith(responseData[i])){
            this.figtherDisplayed.push(responseData[i]);
          }
          this.allFighter.push(responseData[i]);
      }
    },
    err => {
      console.log('error in ETPhoneHome' + err);
    });
  }; 


  showFighter(fighterChoose){
    this.showList = false;
    this.selectedFighter = fighterChoose;
  }
    
  changeAuto(fromItself){
    this.showList = false;
    if(this.isChangeAuto == null || !this.isChangeAuto ){
      this.isChangeAuto = true
    }
    else {
      if(fromItself == null){
        this.isChangeAuto = false;
      }
      

    }

    
    let self = this;
    setTimeout( () => {
      
      self.indexOfCurrentFighter = self.selectedFighter== null ? 0 : self.getIndexOfCurrentFigther();
     
      self.selectedFighter = self.allFighter[ (self.indexOfCurrentFighter + 1) % self.allFighter.length];
      if(self.isChangeAuto){
        self.changeAuto(true);
      }
      
    }, 2000);
  
  }


 backFighter(){
   
    this.indexOfCurrentFighter = this.selectedFighter == null ? 0 : this.getIndexOfCurrentFigther();
    if(this.indexOfCurrentFighter == 0){
     
      this.indexOfCurrentFighter=this.allFighter.length;
    }
    this.selectedFighter = this.allFighter[ (this.indexOfCurrentFighter - 1) % this.allFighter.length];
 }
  nextFighter(){
    this.indexOfCurrentFighter = this.selectedFighter== null ? 0 : this.getIndexOfCurrentFigther();
    
    this.selectedFighter = this.allFighter[ (this.indexOfCurrentFighter + 1) % this.allFighter.length];
  }



  getIndexOfCurrentFigther(){
    for (let i = 0; i < this.allFighter.length; i++) {
      if(this.allFighter[i] == this.selectedFighter){
      
        return i;
      }
    }
  }

  public slidesHeight: string | number;
  public slidesMoving: boolean = true;

  public slideDidChange(): void {
      try {
          this.slidesMoving = false;
          let slideIndex: number = this.slides.getActiveIndex();
          let currentSlide: Element = this.slides._slides[slideIndex];
          this.slidesHeight = currentSlide.clientHeight;
      } catch (e) {}
  }

  public slideWillChange(): void {
      this.slidesMoving = true;
  }
  
 
  


}
