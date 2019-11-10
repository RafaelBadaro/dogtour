import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public alertController: AlertController) { }

  public async abrirAlert(titulo: string, mensagem: string, subTitulo = '') {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subTitulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }
}
