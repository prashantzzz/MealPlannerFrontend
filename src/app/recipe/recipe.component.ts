import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})

export class RecipeComponent implements OnInit {
  title = 'Recipe';
  recipes: any[] = [];
  userRole: string | null = null;
  recipeForm: any = {
    name: '',
    category: '',
    ingredients: '',
    preparationSteps: 0,
    cookingTime: 0,
    servings: 0,
    nutritionalInfo: ''
  };
  editingRecipe: any = null;
  reviews: any[] = [];
  showReviews: boolean = false;
  currentRecipeId: number | null = null;
  reviewVisibility: { [key: number]: boolean } = {};

  constructor(private recipesService: RecipesService, private authService: AuthService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipesService.getAllRecipes().subscribe({
      next: (response) => {
        this.recipes = response.data.map((recipe: any, index: number) => ({
          RecipeId: index + 1, // Generate RecipeId as 1-based index
          ...recipe
        }));
      },
      error: (err) => {
        this.toastr.error('Error loading recipes', 'Error');
        console.error(err);
      },
    });
  }

  showRecipeReviews(recipeId: number): void {
    // Toggle visibility
    if (this.reviewVisibility[recipeId]) {
      this.reviewVisibility[recipeId] = false;
      this.reviews = [];
    } else {
      this.reviewVisibility[recipeId] = true;
      this.recipesService.getReviewsForRecipe(recipeId).subscribe({
        next: (response) => {
          this.reviews = response.data;
          console.log(this.reviews);
        },
        error: (err) => {
          this.toastr.error('Error fetching reviews', 'Error');
          console.error('Error fetching reviews:', err);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.editingRecipe) {
      // Updating existing recipe
      this.recipesService.updateRecipe(this.editingRecipe.id, this.recipeForm).subscribe({
        next: () => {
          this.toastr.success('Recipe updated successfully', 'Success');
          this.loadRecipes();
          this.resetForm();
        },
        error: (err) => {
          this.toastr.error('Error updating recipe', 'Error');
          console.error(err);
        }
      });
    } else {
      // Creating new recipe
      this.recipesService.createRecipe(this.recipeForm).subscribe({
        next: () => {
          this.toastr.success('Recipe created successfully', 'Success');
          this.loadRecipes();
          this.resetForm();
        },
        error: (err) => {
          this.toastr.error('Error creating recipe', 'Error');
          console.error(err);
        }
      });
    }
  }

  editRecipe(recipe: any): void {
    this.editingRecipe = recipe;
    this.recipeForm = { ...recipe };
  }

  deleteRecipe(id: number): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipesService.deleteRecipe(id).subscribe({
        next: () => {
          this.toastr.success('Recipe deleted successfully', 'Success');
          this.loadRecipes();
        },
        error: (err) => {
          this.toastr.error('Error deleting recipe', 'Error');
          console.error(err);
        }
      });
    }
  }

  resetForm(): void {
    this.recipeForm = {
      name: '',
      category: '',
      ingredients: '',
      preparationSteps: 0,
      cookingTime: 0,
      servings: 0,
      nutritionalInfo: ''
    };
    this.editingRecipe = null;
    this.showReviews = false;
    this.reviews = [];
  }
}
