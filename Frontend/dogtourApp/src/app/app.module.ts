import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { CadastroComponent } from './cadastro/cadastro.component';
import { CadastroCachorroComponent } from './cadastro-cachorro/cadastro-cachorro.component';
import { AvaliacaoDonoComponent } from './avaliacao-dono/avaliacao-dono.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SettingsProvider } from './settings-provider';
import { LoadingComponent } from './services/loading/loading.component';
import { LoadingService } from './services/loading.service';
import { AlertService } from './services/alert.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CadastroHorariosComponent } from './cadastro-horarios/cadastro-horarios.component';
import { HorarioComponent } from './cadastro-horarios/horario/horario.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroComponent,
    CadastroCachorroComponent,
    CadastroHorariosComponent,
    HorarioComponent,
    LoadingComponent,
    AvaliacaoDonoComponent
  ],
  entryComponents: [],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    SettingsProvider,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    LoadingService,
    AlertService,
    Geolocation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
