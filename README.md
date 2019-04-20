# comment-box-in-angular-6

Let’s start create a comment component first to post comments.

app.component.html

    <div class="container">
            <div class="card">
                <div class="commentbox">
                    <div class="col-12 col-sm-12 header">
                        <h4>Comments ({{count}})</h4>
                    </div>
                    <div class="col-12 col-sm-12 body">
                        <div class="comment-container">
                                <div class="comment-form">
                                        <app-commentbox (usercomment)="receiveComment($event)"></app-commentbox>
                                </div>
                        </div>
                    </div>
                </div>
                <app-comments [postComment]="comments" (countComments)="recieveCount($event)"></app-comments>
            </div>
        </div>
    
app.component.ts

    import { Component, Input, OnChanges, OnInit } from '@angular/core';


    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
    })
    export class AppComponent implements OnInit {
      comments: string;
      count: number;
      constructor() { }


      ngOnInit() {
        this.count = 0;
      }


      receiveComment($event) {
        this.comments = $event;
        this.count = this.comments.length;
        console.log(this.comments.length);
      }


      recieveCount($event) {
        this.comments = $event;
        this.count = this.comments.length;
      }


    }

commentbox.component.html

    <form [formGroup]="commentForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
            <textarea class="form-control" placeholder="Leave a comment" formControlName="comment" [ngClass]="{ 'is-invalid': submitted && commentForm.controls['comment'].errors }"></textarea>
            <div class="invalid-feedback" *ngIf="submitted && commentForm.controls['comment'].errors">
                <div *ngIf="commentForm.controls['comment'].errors.required">Comment is required</div>
                <div *ngIf="commentForm.controls['comment'].errors.minlength">Comment must be at least 6 characters</div>
                <div *ngIf="commentForm.controls['comment'].errors.maxlength">Comment must be at most 100 characters</div>
            </div>
        </div>
        <div class="form-group">
            <button type="submit" class="btn btn-success">Post Comment</button>
        </div>
    </form>

commentbox.component.ts

    import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
    import { FormGroup, FormBuilder, Validators } from '@angular/forms';


    @Component({
      selector: 'app-commentbox',
      templateUrl: './commentbox.component.html',
      styleUrls: ['./commentbox.component.css']
    })
    export class CommentboxComponent implements OnInit {


      commentForm: FormGroup;
      commentInfo: Array<object> = [];
      submitted: Boolean = false;
      public id = 0;
      @Output() usercomment = new EventEmitter();


      constructor(private formBuilder: FormBuilder) { }


      ngOnInit() {
        this.createForm();
      }


      createForm() {
        this.commentForm = this.formBuilder.group({
          comment: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
        });
      }


      onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.commentForm.invalid) {
          return false;
        } else {
          this.commentInfo.push({
            commentId : this.id++,
            currentDate : new Date(),
            commentTxt: this.commentForm.controls['comment'].value,
            replyComment: []
          });
          this.usercomment.emit(this.commentInfo);
        }
      }



    }

Building the comments component
I have created another component that will list all the existing comments. If no comments exist, i simply don’t render the section. With the help of the NgFor directive, i could display all the existing comments.

comments.component.html

    <div class="comments" *ngIf="postComment!==undefined">
        <h6 *ngIf="postComment?.length<1">No Comments found</h6>
        <ul *ngIf="postComment?.length>0">
            <li *ngFor="let post of postComment; let i = index;">
                <div class="col-12 col-sm-12 comment-container">
                        <p>{{post.commentTxt}}</p>
                        <div class="actions">
                            <span>{{post.currentDate | date: 'dd/MM/yyyy'}}</span>
                            <span class="divider"></span>
                            <button class="btn btn-sm btn-info" (click)="replyComment(i)">
                                Reply
                            </button>
                            <span class="divider"></span>
                            <button class="btn btn-sm btn-danger" (click)="removeComment(i)">
                                <i class="fa fa-trash"></i>
                            </button>
                    </div>
                    <div class="childCommentBox">
                        <div datacontainer></div>
                        <ul *ngIf="post?.replyComment?.length>0">
                            <li *ngFor="let rl of post.replyComment">
                                <div class="col-12 col-sm-12 comment-container">
                                        <p>{{rl.commentTxt}}</p>
                                </div>
                            </li>
                        </ul>            
                    </div>                
                </div>
            </li>
        </ul>
    </div>

comments.component.ts

     removeComment(no) {
        this.postComment.splice(no, 1);
        console.log('After remove array====>', this.postComment);
        this.countComments.emit(this.postComment);
      }


      replyComment(index) {
        this.loadComponent = true;
        const myFactory = this.resolver.resolveComponentFactory(ChildboxComponent);
        if (this.entry.toArray()[index].viewContainerRef.length <= 0 ) {
          const myRef = this.entry.toArray()[index].viewContainerRef.createComponent(myFactory);
          myRef.instance['commentNo'] = index;
          myRef.changeDetectorRef.detectChanges();
          myRef.instance.userReplycomment.subscribe(
            data ​=> {
              console.log('Piyali=>', data);
              this.receiveReplyComment(data, index);
            }
          );
          myRef.instance.deletNo.subscribe(
            no => {
              myRef.destroy();
            }
          );
        }
      }


      receiveReplyComment($event, i) {
        this.reply = $event;
        console.log($event);
        this.postComment.forEach((element) => {
          if (element['commentId'] === i) {
            element['replyComment'].push(...$event);
            console.log('Main array after reply comment=>', this.postComment);
          }
        });
        console.log(this.reply);
        this.loadComponent = false;
      }
<div datacontainer></div> creates dynamic component on click on reply button of each comment. I have created a childbox component dynamically on click "Reply" for each repetition.

childbox.component.ts

    <form [formGroup]="childForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
            <textarea class="form-control" placeholder="Leave a comment" formControlName="comment" [ngClass]="{ 'is-invalid': submitted && childForm.controls['comment'].errors }"></textarea>
            <div class="invalid-feedback" *ngIf="submitted && childForm.controls['comment'].errors">
                <div *ngIf="childForm.controls['comment'].errors.required">Comment is required</div>
                <div *ngIf="childForm.controls['comment'].errors.minlength">Comment must be at least 6 characters</div>
                <div *ngIf="childForm.controls['comment'].errors.maxlength">Comment must be at most 100 characters</div>
            </div>
        </div>
        <div class="form-group">
            <button type="submit" class="btn btn-success">Post Comment</button>
        </div>
    </form>

childbox.component.html

    import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
    import { FormGroup, FormBuilder, Validators } from '@angular/forms';


    @Component({
      selector: 'app-childbox',
      templateUrl: './childbox.component.html',
      styleUrls: ['./childbox.component.css']
    })
    export class ChildboxComponent implements OnInit {


      childForm: FormGroup;
      replyComment: Array<object> = [];
      submitted: Boolean = false;
      @Output() userReplycomment = new EventEmitter();
      @Output() deletNo = new EventEmitter();
      @Input() commentNo: any;


      constructor(private formBuilder: FormBuilder) { }


      ngOnInit() {
        this.createForm();
        console.log('Comment no==>', this.commentNo);
      }


      createForm() {
        this.childForm = this.formBuilder.group({
          comment: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
        });
      }


      onSubmit() {
        this.submitted = true;
        if (this.childForm.invalid) {
          return false;
        } else {
          this.replyComment.push({
            currentDate : new Date(),
            commentTxt: this.childForm.controls['comment'].value
          });
          this.userReplycomment.emit(this.replyComment);
          this.deletNo.emit(this.commentNo);
        }
      }


    }
