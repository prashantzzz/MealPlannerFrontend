# MealPlanner Frontend

This repository contains the Angular frontend for the **MealPlanner** project, designed to help users plan meals, manage dietary preferences, track shopping lists, and generate reports. The application is built using Angular and communicates with a backend API for data storage and authentication.

## Features

1. **Recipes:**
   - Users can browse and search for recipes.
   - View detailed information about each recipe.
   - Option to add selected recipes to meal plans or shopping lists.

2. **Meal Plans:**
   - Create and view personalized meal plans.
   - Modify existing meal plans by adding or removing recipes.
   - Sync meal plans with dietary preferences.

3. **Preferences:**
   - Manage dietary preferences based on the user's role.
   - **Customers**: Add and view personal dietary preferences.
   - **Admin, Nutritionist, or Meal Planner roles**: View preferences of all users.

4. **Shopping List:**
   - Generate and manage a shopping list based on meal plans.
   - Add or remove items manually.

5. **Reports:**
   - Generate reports for meal plans, preferences, and other relevant data.
   - Role-based reports for admins, meal planners, and nutritionists.

6. **Authentication:**
   - Login and signup functionality with JWT-based authentication.
   - Role-based access to various features:
     - **Customer**: Limited to personal meal plans and preferences.
     - **Admin, Nutritionist, Meal Planner**: Access to manage and view data for all users.

---

## Getting Started

### Prerequisites
Ensure the following are installed on your system:
- **Node.js** (v16 or above)
- **Angular CLI** (v15 or above)

### Clone the Repository
```bash
git clone https://github.com/your-repo/mealplanner-frontend.git
cd mealplanner-frontend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
Update the `src/environments/environment.ts` file with the API URL:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7081/api',
};
```

### Run the Application
```bash
ng serve
```
Visit [http://localhost:4200](http://localhost:4200) in your browser to access the application.

---

## File Structure
- **`src/app/`**: Contains all the Angular components and services.
  - **`recipes/`**: Handles recipe browsing and management.
  - **`meal-plans/`**: Manages meal plan creation and viewing.
  - **`preferences/`**: Handles user and role-based dietary preferences.
  - **`shopping-list/`**: Manages shopping list items.
  - **`reports/`**: Generates and displays reports.
  - **`auth/`**: Authentication components and services.

---

## Deployment
1. Build the project:
   ```bash
   ng build --prod
   ```
2. Deploy the `dist/` directory to your preferred hosting service.

---

## Important Notes
- **Authentication Roles**: Ensure the backend roles are correctly mapped to frontend features.
- **CORS**: The backend must allow requests from the frontend's origin.
- **API Documentation**: Refer to the backend API documentation for endpoints and request details.

---

## Contributing
Feel free to submit issues or pull requests for bug fixes or new features.

---


---

Enjoy using the MealPlanner application! 🎉