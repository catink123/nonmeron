import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface MultiselectEntry {
  label: string, 
  value: string, 
  checked?: boolean
}

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss']
})
export class MultiselectComponent {
  @Input() entries?: MultiselectEntry[];
  selectedEntries: string[] = [];
  @Output() entriesChange = new EventEmitter<MultiselectEntry[]>();
  dropdownShown = false;

  constructor() {
    document.addEventListener('click', (e: any) => {
      if (
        e.target.id !== 'dropdownButton' && 
        !e.path.map((val: any) => val.id).includes('dropdown') && 
        this.dropdownShown
      ) this.dropdownShown = false;
    })
  }

  select(value: string, event: any) {
    const state = event.target!.checked;
    if (state) {
      if (!this.selectedEntries.includes(value))
        this.selectedEntries.push(value);
    } else {
      const index = this.selectedEntries.findIndex(val => val === value);
      if (index !== -1)
        this.selectedEntries.splice(index, 1);
    }
    let changedEntries: MultiselectEntry[] = [];
    for (const entry of this.entries!) {
      changedEntries.push({
        ...entry,
        checked: this.selectedEntries.includes(entry.value)
      });
    }
    this.entriesChange.emit(
      changedEntries
    );
  }
}
