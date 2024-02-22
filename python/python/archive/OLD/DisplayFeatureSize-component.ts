import { Item } from '../../types';
import { Component, ViewChild , Output, Input } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ProfileDB } from '../../models/Profile';
import { Department } from '../../models/Department';
import { effect } from '@angular/core';
import { CurrentAppState } from '../../models/AppState';
import { DisplayFeatureSize } from '../../models/DisplayFeatureSize';


export function getRandomInt(max : number) {
  return Math.floor(Math.random() * max);
}

@Component({
  selector: 'app-featuresize',
  templateUrl: 'DisplayFeatureSize-component.html',
})
export class DisplayFeatureSizeComponent {
  @ViewChild('modal', { static: false }) modal!: IonModal;
  @Output() title : string = "Display Feature Size"
  @Output() selectItemID : string = "select-"+getRandomInt(1000000).toString();

    public selectedItemsText: string = ''
    public selectedItem: string = ''

    public items : Item[] = [];
    public currentFeatureName = "";


    constructor() {
      this.selectedItemsText = '0 Items';
      this.selectedItem = "";
      this.items = [];
      this.currentItemChanged() ;

      } 
      currentItemChanged() {
        effect(() => {
          let sizes : DisplayFeatureSize[] = [];
          if (CurrentAppState().currentFeatureName != this.currentFeatureName){

            console.log("Change Feature back to 0");
            //this.selectedItemsText = '0 Items';

            this.currentFeatureName = CurrentAppState().currentFeatureName;
            sizes = ProfileDB.GetFeatureSizes(
              CurrentAppState().currentDepartmentName,
              CurrentAppState().currentItemName,
              CurrentAppState().currentFeatureName);

            this.items = [];
            for (let i=0;i<sizes.length;i++){  
              this.items.push({ 
                  text : sizes[i].name,
                  value : String(sizes[i].name),
                  object : sizes[i]}) 
              } 
            }
            });
      }

    itemSelectionChanged(item: string) {
        console.log("Selection Changed    >>>>>>>>>>>>>>>>>>>"+item);
        this.selectedItem = item;
        console.log("Set Feature  to "+this.selectedItem);

        this.selectedItemsText = item;
        CurrentAppState().currentFeatureName = this.selectedItem; 
        this.modal.dismiss();
      }
}