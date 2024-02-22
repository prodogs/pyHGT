import { Item } from '../../types';
import { Component, ViewChild , Output, Input } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ProfileDB } from '../../models/Profile';
import { Department } from '../../models/Department';
import { CurrentAppState } from '../../models/AppState';
import { signal,effect } from '@angular/core';

export function getRandomInt(max : number) {
  return Math.floor(Math.random() * max);
}

@Component({
  selector: 'app-departmentItems',
  templateUrl: 'DepartmentItems-component.html',
})

export class DepartmentItemsComponent {
  @ViewChild('modal', { static: false }) modal!: IonModal;
  @Output() title : string = "Department Items"
  @Output() selectItemID : string = "select-"+getRandomInt(1000000).toString();

    public selectedItemsText: string = ''
    public selectedItem: string = ''
    public currentDepartmentName : string = ""; 
    public allItems = false;

    public items : Item[] = [];

    constructor() {
      this.selectedItemsText = '0 Items';
      this.selectedItem = "";
      this.items = ProfileDB.GetAllDepartments();
      this.currentDepartmentChanges();
    }

     isBlank(str : string) {
      return (!str || /^\s*$/.test(str));
  }

    isAllItems() : boolean {
      for (let item of this.items){
        if (this.isBlank(item.text) == false){
          return false;
        }
      } 
      return true;

    }
    currentDepartmentChanges() {
        effect(() => {

            if (CurrentAppState().currentDepartmentName != this.currentDepartmentName){
              this.currentDepartmentName = CurrentAppState().currentDepartmentName;
              this.selectedItemsText = '0 Items';
              let deparmentItems = ProfileDB.GetAllDepartmentItems(this.currentDepartmentName);
              this.items = [];
              for (let i=0;i<deparmentItems.length;i++){    
                this.items.push({ 
                    text : deparmentItems[i].name,
                    value :
                    
                    String(deparmentItems[i].name),
                    object : deparmentItems[i]})
              }
            }

            if (this.isAllItems()){
              this.allItems = true;
              this.selectedItemsText = 'All Items';
            }

        });
    }

    itemSelectionChanged(item: string) {
        this.selectedItem = item;
        this.selectedItemsText = this.selectedItem;
        let departmentItem = ProfileDB.GetDepartmentItemByName(this.selectedItem);
        console.log("Department Item "+departmentItem)
        CurrentAppState().currentItemName = this.selectedItem;
        CurrentAppState.mutate(value => value.currentItemName= this.selectedItem )
        console.log("Mutated Signal for AppState Department Item Changed")
        this.modal.dismiss();
      }
}