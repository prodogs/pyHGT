import { Item } from '../../../../../HG/HG/src/app/types';
import { Component, ViewChild , Output, Input } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ProfileDB } from '../../../../../HG/HG/src/app/models/Profile';
import { Department } from '../../../../../HG/HG/src/app/models/Department';
import { effect } from '@angular/core';
import { AppState, CurrentAppState } from '../../../../../HG/HG/src/app/models/AppState';   
import { DisplayFeature } from '../../../../../HG/HG/src/app/models/DisplayFeature';

export function getRandomInt(max : number) {
  return Math.floor(Math.random() * max);
}

@Component({
  selector: 'app-feature',
  templateUrl: 'DisplayFeature-component.html',
})
export class DisplayFeatureComponent {
  @ViewChild('modal', { static: false }) modal!: IonModal;
  @Output() title : string = "Display Feature"
  @Output() selectItemID : string = "select-"+getRandomInt(1000000).toString();

    public selectedItemsText: string = ''
    public selectedItem: string = ''
    public currentItemName : string = "empty";

    public items : Item[] = [];

    constructor() {
      this.selectedItemsText = '0 Items';
      this.selectedItem = "";
      this.items = [];
      this.currentItemChanged()
      }

      currentItemChanged() {
        effect(() => {
          let features : DisplayFeature[] = [];

          if (CurrentAppState().currentItemName != this.currentItemName){
            this.selectedItemsText = '0 Items';
            features = ProfileDB.GetFeatures(
              CurrentAppState().currentDepartmentName,
              CurrentAppState().currentItemName);
            this.items = [];
            for (let i=0;i<features.length;i++){  
              this.items.push({ 
                  text : features[i].name,
                  value : String(features[i].name),
                  object : features[i]}) 
              } 
            }
            });
      }



    itemSelectionChanged(item: string) {
        console.log("Feature Selection Changed>>>>>>>>>>>>>>>>>>>"+item);
        this.selectedItem = item;
        this.selectedItemsText = item;
        this.currentItemName = CurrentAppState().currentItemName;

        CurrentAppState().currentFeatureName = this.selectedItem;
        CurrentAppState.mutate(value => value.currentFeatureName= this.selectedItem )
        console.log("Mutated Signal for AppState  Feature Changed")

        this.modal.dismiss();
      }
}