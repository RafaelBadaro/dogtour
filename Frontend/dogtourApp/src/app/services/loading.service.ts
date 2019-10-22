import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoadingAberto = false;

  public get loadingAberto(){
    return this.isLoadingAberto;
  }

  constructor() { }


  public mostrarLoading() {
    this.isLoadingAberto = true;
  }

  public fecharLoading() {
    this.isLoadingAberto = false;
  }
}
