import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonItem,
  IonLabel,
  IonCardContent,
  IonSkeletonText,
  IonGrid,
  IonRow,
  IonCol,
  IonThumbnail,
} from '@ionic/angular/standalone';
import { BehaviorSubject } from 'rxjs';
import { PaintingCardComponent } from '../components/painting-card/painting-card.component';
import { ApiService } from '../services/api.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-likes-page',
  templateUrl: 'likes.page.html',
  styleUrls: ['likes.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonSkeletonText,
    IonCardContent,
    IonLabel,
    IonItem,
    IonButton,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    AsyncPipe,
    IonThumbnail,
    PaintingCardComponent,
  ],
})
export class LikesPage {
  private api = inject(ApiService);
  isLoading: boolean = true;
  likedObjectId$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  likedObjectId!: any;
  constructor() {}
  // ngOnInit() {
  // console.log(this.likedObjectId);
  //   this.likedObjectId = this.api.likedObjects;
  //   this.likedObjectId$.next(this.likedObjectId);
  //   setTimeout(() => {
  //     this.isLoading = false;
  //   }, 3000);
  // console.log(this.likedObjectId);
  // }
  ionViewWillEnter() {
    this.likedObjectId = this.api.likedObjects;
    this.likedObjectId$.next(this.likedObjectId);
    this.isLoading = false;
  }
}
