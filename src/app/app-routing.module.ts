import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthComponent } from './auth/auth.component';



const appRoutes: Routes = [
  {path: '' , redirectTo: '/recipes', pathMatch: 'full'},
  {path: 'recipes' , loadChildren: () =>import('./recipes/recipes.module').then(m => m.RecipesModule) },  //lazy loading
  {path: 'shopping-list' , loadChildren: () =>import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) },  //lazy loading
  {path: 'auth' , loadChildren: () =>import('./auth/auth.module').then(m => m.AuthModule) },  //lazy loading
  
 
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],  // prealoads all modules in advance
  exports: [RouterModule]
})
export class AppRoutingModule { }
