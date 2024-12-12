import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto'; // Import Chart.js with all plugins

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, AfterViewInit {
  // ViewChild references for charts
  @ViewChild('userRolesChart') userRolesChart!: ElementRef;
  @ViewChild('recipePopularityChart') recipePopularityChart!: ElementRef;
  @ViewChild('dietaryPreferencesChart') dietaryPreferencesChart!: ElementRef;
  @ViewChild('mostUsedIngredientsChart') mostUsedIngredientsChart!: ElementRef;

  reports: any = null;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  generateReports(): void {
    this.reportsService.fetchReports().subscribe((data) => {
      this.reports = data;

      // Format ratings
      this.reports.recipePopularity = this.reports.recipePopularity.map((recipe: any) => ({
        ...recipe,
        formattedAverageRating: recipe.averageRating.toFixed(1),
      }));

      // Create charts after data is loaded
      setTimeout(() => {
        this.createUserRolesChart();
        this.createRecipePopularityChart();
        this.createDietaryPreferencesChart();
        this.createMostUsedIngredientsChart();
      }, 0);

      // Rest of the existing generateReports method...
      this.reportsService.deleteAllReports().subscribe({
        // ... existing code
      });
    });
  }

  private createUserRolesChart(): void {
    if (!this.userRolesChart?.nativeElement) {
      console.error('User roles chart element is not available.');
      return;
    }
    const roles = this.reports.userStatistics.roles;
    new Chart(this.userRolesChart.nativeElement, {
      type: 'pie',
      data: {
        labels: Object.keys(roles),
        datasets: [{
          data: Object.values(roles),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'User Roles Distribution'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  private createRecipePopularityChart(): void {
    const recipes = this.reports.recipePopularity;
    new Chart(this.recipePopularityChart.nativeElement, {
      type: 'bar',
      data: {
        labels: recipes.map((r: any) => r.name),
        datasets: [{
          label: 'Average Rating',
          data: recipes.map((r: any) => r.averageRating),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 5
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Recipe Popularity by Average Rating'
          },
          legend: {
            display: false
          }
        }
      }
    });
  }

  private createDietaryPreferencesChart(): void {
    const preferences = this.reports.dietaryPreferences;
    new Chart(this.dietaryPreferencesChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: preferences.map((p: any) => p.type),
        datasets: [{
          data: preferences.map((p: any) => p.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Dietary Preferences'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  private createMostUsedIngredientsChart(): void {
    const ingredients = this.reports.mealPreparationAnalysis.mostUsedIngredients;
    new Chart(this.mostUsedIngredientsChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ingredients.map((i: any) => i.name),
        datasets: [{
          label: 'Usage Count',
          data: ingredients.map((i: any) => i.count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // This makes the bar chart horizontal
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Most Used Ingredients'
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }

  get objectKeys() {
    return Object.keys;
  }
}