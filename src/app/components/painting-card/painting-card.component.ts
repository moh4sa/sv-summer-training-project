import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonThumbnail,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
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
    IonIcon,
    IonCol,
    IonRow,
    IonGrid,
    IonButton,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    AsyncPipe,
    NgOptimizedImage,
  ],
})
export class PaintingCardComponent implements OnInit {
  isLiked: boolean = false;
  private router = inject(Router);
  private api = inject(ApiService);
  objectId = input.required<number>();
  destroyMe = output<void>();
  paintingObject!: any;
  currentUrl: string = this.router.url;
  numberOfLikes$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    this.api.getPaintingObject(this.objectId()).subscribe({
      next: (response) => {
        if (!response?.primaryImageSmall) {
          console.warn(
            `(ID: ${this.objectId()}): Painting object is missing an image. Component will be destroyed.`
          );
          this.destroyMe.emit();
          return;
        }
        this.paintingObject = {
          ...response,
          title: response.title?.trim() || 'Untitled',
        };
      },
      error: (error) => {
        console.error(
          `(ID: ${this.objectId()}): Error fetching item details ${error}`
        );
        this.destroyMe.emit(); // Emit destroyMe on API error
      },
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
