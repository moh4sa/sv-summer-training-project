import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardSubtitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonBackButton,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonInput,
  IonSpinner,
  IonItemDivider,
  IonImg,
} from '@ionic/angular/standalone';
import { PaintingCardComponent } from '../components/painting-card/painting-card.component';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-painting-info',
  templateUrl: './painting-info.page.html',
  styleUrls: ['./painting-info.page.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonItemDivider,
    IonSpinner,
    IonInput,
    IonList,
    IonLabel,
    IonItem,
    IonCardContent,
    IonBackButton,
    IonButton,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCardSubtitle,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    PaintingCardComponent,
    ReactiveFormsModule,
  ],
})
export class PaintingInfoPage implements OnInit {
  private router = inject(Router);
  private api = inject(ApiService);
  requiredError: string = 'field should not be empty';
  minError: string = 'field cant be less than of 2 characters';
  stringError: string = 'field should only has alphabet letters';
  errorMessage: string = '';
  paintingObject: any;
  objectComments: any;
  isLoading: boolean = true;

  commentForm = new FormGroup({
    item_id: new FormControl(''),
    username: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z]+$'),
      Validators.minLength(2),
    ]),
    comment: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z]+$'),
      Validators.minLength(2),
    ]),
  });

  constructor() {}
  ngOnInit() {
    this.paintingObject = this.router.getCurrentNavigation()?.extras.state;
    this.getComments();
  }

  onSubmit() {
    console.log(this.commentForm.value);
    this.api.addCommentByObject(this.commentForm.value).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getComments();
      },
      error: (err) => {
        console.error(err);
        this.getComments();
      },
    });
  }

  getComments() {
    this.api.getCommentByObject(this.paintingObject.objectID).subscribe({
      next: (response) => {
        this.objectComments = response;
        this.isLoading = false;
      },
      error: (error) => {
        // console.error(error);
        this.isLoading = false;
        return;
      },
    });
  }

  inputChange($event: any) {
    if (this.username !== null) {
      // console.log(this.username.errors);
      if (this.username.hasError('required')) {
        this.errorMessage = this.requiredError;
      } else if (this.username.hasError('pattern')) {
        this.errorMessage = this.stringError;
      } else if (this.username.hasError('minlength')) {
        console.log(this.username.errors);
        this.errorMessage = this.minError;
      }
    }
    if (this.commentForm !== null) {
      // console.log(this.username.errors);
      if (this.commentForm.hasError('required')) {
        this.errorMessage = this.requiredError;
      } else if (this.commentForm.hasError('pattern')) {
        this.errorMessage = this.stringError;
      } else if (this.commentForm.hasError('minlength')) {
        console.log(this.commentForm.errors);
        this.errorMessage = this.minError;
      }
    }
  }

  get username() {
    return this.commentForm.get('username');
  }
  get comment() {
    return this.commentForm.get('comment');
  }
}
