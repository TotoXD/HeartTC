// Modules importés

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { CatalogComponent } from './catalog/catalog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from "@angular/router";
import { MenuComponent } from './menu/menu.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component'
import { AuthService } from './service/auth-service';
import { UserService } from './service/user.service';
import { LobbyComponent } from './lobby/lobby.component';
import { PlayService } from './service/play.service';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/noauth.guard';
import { TokenInterceptor } from './interceptor/token-interceptor';
import { ProfileComponent } from './profile/profile.component';
import { ChooseDeckComponent } from './choose-deck/choose-deck.component';

const appRoutes: Routes = [

/* Removed Auth 
// Page initiale du menu
{ path: '', component: MenuComponent },

// Pages accessibles lorsque connecté
{path: '', children: [
  { path: 'jeu', component: CatalogComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'deck', component: ChooseDeckComponent },

], canActivate: [AuthGuard], canActivateChild: [AuthGuard]},

// Pages accesibles lorsque déconnecté
{ path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
{ path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
{ path: 'lobby', component: LoginComponent, canActivate: [NoAuthGuard] },
*/

// Page initiale du menu
{ path: '', component: MenuComponent },

{ path: 'jeu', component: CatalogComponent },
{ path: 'lobby', component: LobbyComponent },
{ path: 'deck', component: ChooseDeckComponent },

// Route pour gérer l'erreur 404 (page non trouvée)
{
  path: '**', pathMatch: 'full', component: PagenotfoundComponent
}
]

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    CatalogComponent,
    MenuComponent,
    RegisterComponent,
    LoginComponent,
    LobbyComponent,
    PagenotfoundComponent,
    ProfileComponent,
    ChooseDeckComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
  ],
  providers: [AuthService, UserService, PlayService, 
  /* Removed Auth{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }*/],
  bootstrap: [AppComponent]
})
export class AppModule { }
