import { Component, OnInit,Input,Output } from '@angular/core';
import { Department } from '../../../test1/src/app/models/department-model';
import { AppState } from '../../../test1/src/app/models/AppState';
import { EventEmitter } from '@angular/core';
import { IonImg } from '@ionic/angular';


@Component({
  standalone: true,
  selector: 'app-department-row',
  templateUrl: './department-row.component.html',
  styleUrls: ['./department-row.component.scss'],
})




export class DepartmentRowComponent implements OnInit {
  @Input() department!: Department;
  @Output() newDepartmentEvent = new EventEmitter<Department>();

  onSelectDepartment(department: Department) {
    console.log('Selected Item', department);
    AppState.SetSelectedDepartment(department);
    this.newDepartmentEvent.emit(department);
    console.log('Emitting newDepartmentEvent');
    this.department = department;
  }
  constructor() {}

  ngOnInit() {}
}

