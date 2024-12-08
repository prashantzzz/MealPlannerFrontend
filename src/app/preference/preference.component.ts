import { Component, OnInit } from '@angular/core';
import { PreferenceService } from '../services/preference.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-preference',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './preference.component.html',
  styleUrl: './preference.component.css'
})

export class PreferenceComponent implements OnInit {
  preferences: any[] = [];
  isEditMode = false;
  currentPreference: any = { preferenceType: '', description: '' };

  constructor(private preferenceService: PreferenceService) {}

  ngOnInit(): void {
    this.fetchPreferences();
  }

  fetchPreferences(): void {
    this.preferenceService.getPreferences().subscribe((res: any) => {
      this.preferences = res.data;
    });
  }

  editPreference(preference: any): void {
    this.isEditMode = true;
    this.currentPreference = { ...preference };
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.preferenceService
        .updatePreference(this.currentPreference.preferenceId, this.currentPreference)
        .subscribe(() => {
          this.fetchPreferences();
          this.resetForm();
        });
    } else {
      this.preferenceService.createPreference(this.currentPreference).subscribe(() => {
        this.fetchPreferences();
        this.resetForm();
      });
    }
  }

  deletePreference(id: number): void {
    this.preferenceService.deletePreference(id).subscribe(() => {
      this.fetchPreferences();
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.currentPreference = { preferenceType: '', description: '' };
  }
}
