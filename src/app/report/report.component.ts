import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  reports: any = null;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {}

  
  generateReports(): void {
    this.reportsService.fetchReports().subscribe((data) => {
      const recipes = data.recipes.data; // Adjust based on your API structure
      const reviews = data.reviews.data;
  
      const recipePopularity = this.reportsService.processRecipePopularity(recipes, reviews).map((recipe: any) => ({
        ...recipe,
        formattedAverageRating: recipe.averageRating.toFixed(1), // Keep one decimal point
      }));
  
      this.reports = {
        ...data,
        recipePopularity,
      };
    });
  }
  
  

  get objectKeys() {
    return Object.keys;
  }
}
