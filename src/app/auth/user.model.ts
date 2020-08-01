

export class User {
    
    constructor(
        public email: string, 
        public id: string, 
        private _token: string, 
        private _tokenExpirationDate: Date){
       
    }

    // to check the validaty of the token we need to add getter
    // Getter looks like a function, but we need to access it like a property

    get token(){
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return null;
        }
        return this. _token;
    }
}