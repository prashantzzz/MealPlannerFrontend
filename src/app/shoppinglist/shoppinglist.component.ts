import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-shoppinglist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shoppinglist.component.html',
  styleUrls: ['./shoppinglist.component.css']
})
export class ShoppinglistComponent implements OnInit {
  ingredients: any[] = [];
  recipeId: number | null = null;

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {}

  fetchIngredients(): void {
    if (!this.recipeId) {
      alert('Please provide a Recipe ID');
      return;
    }

    this.recipesService.getRecipeById(this.recipeId).subscribe({
      next: (recipe) => {
        this.ingredients = recipe.ingredients || [];
      },
      error: () => alert('Error fetching ingredients'),
    });
  }
}
