import { AsyncPipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonThumbnail,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSkeletonText,
  IonLabel,
  IonImg,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-painting-card',
  templateUrl: './painting-card.component.html',
  styleUrls: ['./painting-card.component.scss'],
  standalone: true,
  imports: [
    IonNote,
    IonImg,
    IonLabel,
    IonSkeletonText,
    IonIcon,
    IonCol,
    IonRow,
    IonGrid,
    IonButton,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonThumbnail,
    AsyncPipe,
  ],
})
export class PaintingCardComponent implements OnInit {
  isLiked: boolean = false;
  private router = inject(Router);
  objectId = input.required<number>();
  paintingObject!: any;
  currentUrl: string = this.router.url;
  numberOfLikes$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private api: ApiService) {
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    this.api.getPaintingObject(this.objectId()).subscribe((response) => {
      //console.log(response);
      if (!response.primaryImageSmall) {
        return;
      }
      this.paintingObject = response;
    });
    this.isPaintingLiked(this.objectId());
    this.fetchLikes();
    // console.log(this.router.url, 'current url');
  }

  navigateToPaintingInfo(paintingObject: any) {
    this.router.navigateByUrl('/painting-info', { state: paintingObject });
  }

  toggleLike(paintingObjectId: any) {
    //console.log(this.api.likedObjects);
    //console.log(this.isLiked);

    this.isLiked = !this.isLiked;
    // add only unique values
    if (!this.api.likedObjects.includes(paintingObjectId)) {
      this.api.likedObjects.push(paintingObjectId);
      //console.log('pushed: ', this.api.likedObjects);
      const obj = {
        item_id: this.objectId().toString(),
      };
      this.api.addLikeByObject(obj).subscribe(); // add like through api
      this.fetchLikes();
    } else {
      this.api.likedObjects = this.api.likedObjects.filter(
        (item) => item !== paintingObjectId
      );
      // console.log('filtered: ', this.api.likedObjects);
    }
    localStorage.setItem('likes', JSON.stringify(this.api.likedObjects));
  }

  isPaintingLiked(paintingObjectId: number) {
    if (this.api.likedObjects.includes(paintingObjectId)) {
      this.isLiked = true;
    } else {
      this.isLiked = false;
    }
  }

  fetchLikes() {
    this.api.getLikes().subscribe((response) => {
      if (
        response.find((value: any) => value.item_id === this.objectId()) ||
        response.find(
          (value: any) => value.item_id === this.objectId().toString()
        )
      ) {
        for (let i = 0; i < response.length; i++) {
          if (
            response[i].item_id === this.objectId() ||
            response[i].item_id === this.objectId().toString()
          ) {
            this.numberOfLikes$.next(response[i].likes);
            return;
          }
        }
      }
    });
  }
}
