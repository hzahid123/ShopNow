import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chips-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chips-component.component.html',
  styleUrl: './chips-component.component.scss'
})
export class ChipsComponentComponent {
  @Input() availableChips: string[] = [];
  @Input() selectedChips: string[] = [];
  @Output() chipsChange = new EventEmitter<string[]>();

  currentChipControl = new FormControl('');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private announcer: LiveAnnouncer) { }

  filteredChips(): string[] {
    const currentChip = this.currentChipControl.value?.toLowerCase() || '';
    return currentChip
      ? this.availableChips.filter(chip => chip.toLowerCase().includes(currentChip))
      : this.availableChips.slice();
  }

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    
    if (value && !this.selectedChips.includes(value)) {
      this.selectedChips.push(value);
      this.chipsChange.emit(this.selectedChips);
    }

    if (event.chipInput) {
      event.chipInput.clear();
    }

    this.currentChipControl.setValue('');
  }

  removeChip(chip: string): void {
    this.selectedChips = this.selectedChips.filter(c => c !== chip);
    this.chipsChange.emit(this.selectedChips);
    this.announcer.announce(`Removed ${chip}`);
  }

  selectedChip(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedChips.includes(event.option.viewValue)) {
      this.selectedChips.push(event.option.viewValue);
      this.chipsChange.emit(this.selectedChips);
    }
    this.currentChipControl.setValue('');
    event.option.deselect();
  }
}
