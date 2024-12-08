import { Component, OnInit } from '@angular/core';
import { MealplansService } from '../services/mealplans.service';
import { RecipesService } from '../services/recipes.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-shoppinglist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shoppinglist.component.html',
  styleUrls: ['./shoppinglist.component.css'],
})
export class ShoppinglistComponent implements OnInit {
  shoppingList: any[] = [];
  loading = false;

  constructor(
    private mealplansService: MealplansService,
    private recipesService: RecipesService
  ) {}

  ngOnInit(): void {
    this.fetchMealPlansAndIngredients();
  }

  fetchMealPlansAndIngredients(): void {
    this.loading = true;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated');
      this.loading = false;
      return;
    }

    this.mealplansService.getMealPlans().subscribe({
      next: (mealPlans) => {
        const recipeIds = mealPlans.data.map((plan: any) => plan.recipeId);
        this.fetchIngredientsForRecipes(recipeIds);
      },
      error: () => {
        alert('Error fetching meal plans');
        this.loading = false;
      },
    });
  }

  fetchIngredientsForRecipes(recipeIds: number[]): void {
    const ingredientPromises = recipeIds.map((id) =>
      this.recipesService.getRecipeById(id).toPromise()
    );

    Promise.all(ingredientPromises)
      .then((responses) => {
        this.shoppingList = responses.map((response: any, index) => ({
          recipeId: recipeIds[index],
          recipeName: response.data.name,
          ingredients: response.data.ingredients
            .split(',')
            .map((ing: string) => ({ name: ing.trim(), bought: false })),
        }));
      })
      .catch(() => alert('Error fetching ingredients'))
      .finally(() => (this.loading = false));
  }

  toggleBought(recipeId: number, ingredientName: string): void {
    const recipe = this.shoppingList.find((item) => item.recipeId === recipeId);
    if (recipe) {
      const ingredient = recipe.ingredients.find((ing: any) => ing.name === ingredientName);
      if (ingredient) {
        ingredient.bought = !ingredient.bought;
      }
    }
  }
}
