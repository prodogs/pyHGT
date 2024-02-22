import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { OnInit } from '@angular/core';
import { Item } from '../../../../../../HG/HG/src/app/types';

@Component({
  selector: 'app-typeahead',
  templateUrl: 'typeahead-component.html',
})

export class TypeaheadComponent implements OnInit {
  @Input() items: Item[] = [];
  @Input() selectedItem : string = "";
  @Input() title = 'Select Items';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string>();

  filteredItems: Item[] = [];
  workingSelectedValue: string ='';

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.workingSelectedValue = this.selectedItem;
    console.log('ngOnInit ')
  }

  trackItems(index: number, item: Item) {
    return item.value;
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.selectedItem);
    console.log("Confirm Changes >>>"+this.selectedItem);
  }

  searchbarInput(ev: { target: { value: string | undefined; }; }) {
    this.filterList(ev.target.value);
  }

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  filterList(searchQuery: string | undefined) {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.filteredItems = [...this.items];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item) => {
        return item.text.toLowerCase().includes(normalizedQuery);
      });
    }
  }



  buttonPressed(event : Event, itemText : string) {
    console.log("Button Pressed " + itemText)
    this.selectedItem = itemText

  }

}
