import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  reports: any = null;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {}

  generateReports(): void {
    // Fetch the report data
    this.reportsService.fetchReports().subscribe((data) => {
      this.reports = data;

      // Format ratings to keep one decimal point
      this.reports.recipePopularity = this.reports.recipePopularity.map((recipe: any) => ({
        ...recipe,
        formattedAverageRating: recipe.averageRating.toFixed(1), // Keep one decimal point
      }));

      // First delete all previous reports
      this.reportsService.deleteAllReports().subscribe({
        next: () => {
          console.log('Previous reports deleted successfully.');

          // Post each section of the report as individual rows
          const sections = [
            { reportType: 'UserStatistics', data: JSON.stringify(this.reports.userStatistics) },
            { reportType: 'RecipePopularity', data: JSON.stringify(this.reports.recipePopularity) },
            { reportType: 'MealPlanUtilization', data: JSON.stringify(this.reports.mealPlanUtilization) },
            { reportType: 'ShoppingListStatus', data: JSON.stringify(this.reports.shoppingListStatus) },
            { reportType: 'DietaryPreferences', data: JSON.stringify(this.reports.dietaryPreferences) },
            { reportType: 'MealPreparationAnalysis', data: JSON.stringify(this.reports.mealPreparationAnalysis) }
          ];

          // Post each section one by one
          sections.forEach(section => {
            const reportData = {
              ...section,
              generatedDate: new Date().toISOString(),
              createdBy: localStorage.getItem('username') // Assuming username is stored in localStorage
            };

            this.reportsService.generateReport(reportData).subscribe({
              error: (err) => {
                console.error('Error posting section:', err);
              }
            });
          });
        },
        error: (err) => {
          console.error('Error deleting previous reports:', err);
        }
      });
    });
  }

  get objectKeys() {
    return Object.keys;
  }
}
