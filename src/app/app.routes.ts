import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard'; 
import { RecipeComponent } from './recipe/recipe.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MealplanComponent } from './mealplan/mealplan.component';
import { PreferenceComponent } from './preference/preference.component';
import { ShoppinglistComponent } from './shoppinglist/shoppinglist.component';
import { ReportComponent } from './report/report.component';
import { TermsComponent } from './terms/terms.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'mealplan', component: MealplanComponent },
  { path: 'preferences', component: PreferenceComponent },
  { path: 'shoppinglist', component: ShoppinglistComponent },
  { path: 'reports', component: ReportComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'recipes', component: RecipeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' } 
];
