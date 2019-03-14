Wikipedia content fetch using Wikipedia's API

app.component.html

    <div class="container">
        <form [formGroup]="searchForm" novalidate>
            <div class="col-md-12 form-group">
                <label>Search Text</label>
                <input type="text" formControlName="search" name="search" class="form-control" />
            </div>
            <div class="col-md-12 form-group">
                <button class="btn btn-success" (click)="searchTxt()">Search</button>
            </div>
        </form>
        <div class="loading" *ngIf="isLoading">Loading</div>
        <div class="col-md-12" *ngIf="!isLoading">
            <h3>{{title}}</h3>
            <div [innerHTML]="results"></div>
        </div>
    </div>

app.component.ts


      searchTxt() {
        this.isLoading = true;
        // tslint:disable-next-line:prefer-const
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        // headers.append('Access-Control-Allow-Origin', '*');
        this.txt = this.searchForm.controls['search'].value;
        this.txt = this.txt.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join('_');
        console.log(this.txt);
        // tslint:disable-next-line:max-line-length
        // this.url = 'https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=' + this.txt + '&redirects=true';
        this.url = 'https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=parse&page=' + this.txt;
        // tslint:disable-next-line:max-line-length
        this.http.post(this.url, { headers: headers })
          .subscribe(
            data => {
              console.log(data);
              if (data['error']) {
                this.results = 'Page not found';
                this.isLoading = false;
              } else {
                this.title = data['parse'].displaytitle;
                this.results = data['parse'].text['*'];
                this.isLoading = false;
              }
            },
            err => {
              this.results = 'Page not found';
              this.isLoading = false;
            }
          );
      }


      createForm() {
        this.searchForm = this.formBuilder.group({
          search: ['']
        });
      }

app.module.ts

    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { FormsModule, ReactiveFormsModule} from '@angular/forms';
    import { AppComponent } from './app.component';
    import { HttpClientModule } from '@angular/common/http';


    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }

https://cors-anywhere.herokuapp.com/ ----- this is used as CORS middlewhere. CORS allows you to configure the web API's security. It has to do with allowing other domains to make requests against your web API. For example, if you had your web API on one server and your web app on another you could configure CORS in your Web API to allow your web app to make calls to your web API.

if i hit the URL 'https://en.wikipedia.org/w/api.php?format=json&action=parse&page=' directly then we got the error as : 

Access to XMLHttpRequest at 'https://en.wikipedia.org/w/api.php?format=json&action=parse&page=Tiger' from origin 'http://localhost:4200' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.

Get CORS video from the URL : https://www.youtube.com/watch?v=HgdAwvt2vSs
