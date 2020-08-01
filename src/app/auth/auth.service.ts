import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap} from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { EmailValidator } from '@angular/forms';
import {User} from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {

    // this subject is a subject to which we can subscribe and we will get ingformation whenever new data is emitted
    //user = new Subject<User>(); 

    // we have to also save the token in a way, so we can have an access to it, by applying BehaviourSubject
    // difference between subject and behaviourSubject is that behSubject also gives to subscribers immediate access to the prevouisly emitted value  
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any; 

    constructor(private http: HttpClient, private router: Router){}

    // register new user

    singup(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=<yourAPIkey>', 
                        {
                            email: email, 
                            password: password, 
                            returnSecureToken: true
                        }
        ).pipe(
            // tap operator allows us to perform some action without changing a response 
            catchError(this.handleError), tap(resData =>{
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })
        );
        
        
    }

    login(email: string, password: string){
        // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=<yourAPIkey>', 
                        {
                            email: email, 
                            password: password, 
                            returnSecureToken: true
                        }
        ).pipe(
            catchError(this.handleError), tap(resData =>{
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })
        );
    }

    // if in localStorage , we have existing user , this method will check it by retrieving data from localStorage
    autoLogin(){
        // retrive the token from localStorage, since we have saved as a string, we have to convert it again to JS object here
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData){
            return;
        }
        const loadedUser =  new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );
        
        if(loadedUser.token){

            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime(); // duration = future time - current time
            this.autoLogout(expirationDuration); 
        }
    }
    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    //tokens live 1 hour , so we need method automatically logs out when the timer is done. 
    autoLogout(expirationDuration: number){
      this.tokenExpirationTimer = setTimeout(() =>{
          this.logout();
      }, expirationDuration);
    }

    private handleAuthentication(email:string, userId: string, token:string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + +expiresIn*1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);

        // we need to store token in localStorage of the browser
        localStorage.setItem('userData', JSON.stringify(user));

    }

    private handleError(errorRes: HttpErrorResponse){

        let errorMessage='An unknown error occured!';
                if (!errorRes.error || !errorRes.error.error){
                    return throwError(errorMessage);
                }

                switch(errorRes.error.error.message){
                    case 'EMAIL_EXISTS':
                        errorMessage='This email exists already';
                        break;
                    case 'EMAIL_NOT_FOUND':
                        errorMessage='This email does not exist';
                        break;
                    case 'INVALID_PASSWORD':
                        errorMessage='This password is not correct';
                        break;        
                }

                return throwError(errorMessage);
    }



}