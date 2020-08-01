import {Recipe} from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
@Injectable()

export class RecipeService{

    recipesChanged = new Subject<Recipe[]>();
    

    /*recipes: Recipe[] =[
        new Recipe('A test recipe', 'This is simply a test', 'https://www.bonappetit.com/recipe/slow-roast-gochujang-chicken', 
        [new Ingredient('Meat', 1), new Ingredient('French freis', 10)]),
        new Recipe('Another test recipe', 'This is complex a test', 'https://www.bonappetit.com/recipe/slow-roast-gochujang-chicken', [
            new Ingredient('Buns', 1), new Ingredient('Cheese', 10)
        ])]; */

    recipes: Recipe[] = [];
    constructor(private slService: ShoppingListService){}

    setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());

    }
    
    getRecipes(){
        return this.recipes.slice();
    }

    getRecipe(index: number){
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());

    }

    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index]= newRecipe;
        this.recipesChanged.next(this.recipes.slice());

    }
    deleteRecipe(index:number){
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}