import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Recipe} from '../recipes/recipe.model';
import {RecipeService} from '../recipes/recipe.service';
import { fromEventPattern } from 'rxjs';
import {map, tap, take, exhaustMap} from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})

export class DataStorageService {

    constructor(private http: HttpClient, 
                private recipeService: RecipeService, 
                private authService: AuthService){
     
    }
    storeRecipes(){
        const recipes = this.recipeService.getRecipes();
        
        
        // token that we are storing in the user object in authService has to be attached into url
        this.http.put('https://ng-course-recipe-book-b08a5.firebaseio.com/recipes.json', recipes)
                .subscribe(response => {
                    console.log(response);
                });
        
    }
    fetchRecipes(){
        // to combine user and http observable into one
       
        return this.http
            .get<Recipe[]>(
                    // for firebase and the real time Db rest API , we add token as query paramater in the url, for other APIs as a header
                    'https://ng-course-recipe-book-b08a5.firebaseio.com/recipes.json', 
                   
            )
            .pipe(
                map(recipes => {
                return recipes.map(recipe =>{
                        return {
                            ...recipe, 
                            ingredients : recipe.ingredients ? recipe.ingredients: []
                        };
                });
                }), 
            tap(recipes => {
                    this.recipeService.setRecipes(recipes);
            })
        );
               

    }
}