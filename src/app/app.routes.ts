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

  //auth guard ensures If authenticated: returns true; else it redirects to the /login page and denies access (return false).
  { path: 'mealplan', component: MealplanComponent, canActivate: [AuthGuard] },
  { path: 'preferences', component: PreferenceComponent, canActivate: [AuthGuard] },
  { path: 'shoppinglist', component: ShoppinglistComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'recipes', component: RecipeComponent, canActivate: [AuthGuard] },
  
  { path: 'terms', component: TermsComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
