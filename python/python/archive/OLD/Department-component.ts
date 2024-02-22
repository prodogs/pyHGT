import { Item } from '../../types';
import { Component, ViewChild , Output, Input } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ProfileDB } from '../../models/Profile';
import { Department } from '../../models/Department';
import { AppState,CurrentAppState } from '../../models/AppState';
 
export function getRandomInt(max : number) {
  return Math.floor(Math.random() * max);
}

@Component({
  selector: 'app-department',
  templateUrl: 'Department-component.html',
})

export class DepartmentComponent {
  @ViewChild('modal', { static: false }) modal!: IonModal;
  @Output() title : string = "Department"
  @Output() selectItemID : string = "select-"+getRandomInt(1000000).toString();

    public selectedItemsText: string = ''
    public selectedItem: string = ''

    @Output() items : Item[] = [];

    constructor() {
      this.selectedItemsText = '0 Items';
      this.selectedItem = "";
      this.items = ProfileDB.GetAllDepartments();
      } 

      ngOnInit() {
        let departments = ProfileDB.GetAllDepartments();
        for(let i=0;i<departments.length;i++){
          let department = departments[i];
          this.items.push({
            text : department.department_name,
            value : String(department.department_number),
            object : department
          });
      }
      

  }
 

  itemSelectionChanged(item: string) {
    console.log("Selection Changed>>>>>>>>>>>>>>>>>>>"+item);
    this.selectedItem = item;
    let department = ProfileDB.GetDepartmentByName(this.selectedItem);
    console.log(department)
    this.selectedItemsText = this.selectedItem;
    let appState = CurrentAppState()
    appState.currentDepartmentName = this.selectedItem;
    CurrentAppState.mutate(value => value.currentDepartmentName = this.selectedItem )
    console.log("Mutated Signal for AppState")
    this.modal.dismiss();
  }
}