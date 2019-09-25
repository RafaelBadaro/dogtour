import { Injectable } from '@angular/core';


@Injectable()
export class SettingsProvider{

    private config : any;

    constructor(){
        this.config = {
            iss: 'https://securetoken.google.com/dog7our',
            usuario_url: 'user',
            login_url : 'login'
        }
    }

    public get getConfiguration(): any {
        return this.config;
    }

}