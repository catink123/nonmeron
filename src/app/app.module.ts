import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PostComponent } from './pages/post/post.component';
import { AboutComponent } from './pages/about/about.component';
import { PostCardComponent } from './post-card/post-card.component';
import { environment } from '../environments/environment';
import { ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { AngularFireModule } from '@angular/fire/compat';
import { SETTINGS as AUTH_SETTINGS } from '@angular/fire/compat/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoComponent } from './pages/account/info/info.component';
import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { ResetComponent } from './pages/account/reset/reset.component';
import { CommentBoxComponent } from './pages/post/comment-box/comment-box.component';
import { CommentComponent } from './pages/post/comment/comment.component';
import { LikeButtonComponent } from './pages/post/like-button/like-button.component';
import { SearchComponent } from './pages/search/search.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { MultiselectComponent } from './components/multiselect/multiselect.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostComponent,
    AboutComponent,
    PostCardComponent,
    InfoComponent,
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    CommentBoxComponent,
    CommentComponent,
    LikeButtonComponent,
    SearchComponent,
    PageNotFoundComponent,
    AdminComponent,
    MultiselectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
    AngularFireAnalyticsModule,
    AngularFireStorageModule,
    BrowserAnimationsModule
  ],
  providers: [
    ScreenTrackingService,UserTrackingService,
    {provide: AUTH_SETTINGS, useValue: {appVerificationDisabledForTesting: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
