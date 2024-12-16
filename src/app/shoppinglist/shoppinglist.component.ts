import { Component, OnInit } from '@angular/core';
import { MealplansService } from '../services/mealplans.service';
import { RecipesService } from '../services/recipes.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
    private recipesService: RecipesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchMealPlansAndIngredients();
  }

  fetchMealPlansAndIngredients(): void {
    this.loading = true;

    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('User not authenticated', 'Error');
      this.loading = false;
      return;
    }

    this.mealplansService.getMealPlans().subscribe({
      next: (mealPlans) => {
        const recipeIds = mealPlans.data.map((plan: any) => plan.recipeId);
        this.fetchIngredientsForRecipes(recipeIds);
      },
      error: () => {
        this.toastr.error('No meal plan assigned!', 'Error');
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
      .catch(() => {
        this.toastr.error('Error fetching ingredients', 'Error');
      })
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
