import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CommentboxComponent } from './commentbox/commentbox.component';
import { CommentsComponent } from './comments/comments.component';
import { ChildboxComponent } from './childbox/childbox.component';
import { DatacontainerDirective } from './comments/comments.component';


@NgModule({
  declarations: [
    AppComponent,
    CommentboxComponent,
    CommentsComponent,
    ChildboxComponent,
    DatacontainerDirective
  ],
  providers: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  entryComponents: [ChildboxComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
