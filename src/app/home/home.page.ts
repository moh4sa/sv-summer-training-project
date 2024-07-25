import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardSubtitle,
  IonSkeletonText,
  IonCol,
  IonCardTitle,
  IonRow,
  IonGrid,
  IonThumbnail,
  IonCardHeader,
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { PaintingCardComponent } from '../components/painting-card/painting-card.component';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonCardHeader,
    IonGrid,
    IonRow,
    IonCardTitle,
    IonCol,
    IonSkeletonText,
    IonCardSubtitle,
    IonCard,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonThumbnail,
    PaintingCardComponent,
  ],
})
export class HomePage implements OnInit {
  objects: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.getAllPaintingObjects().subscribe((response) => {
      // console.log(response.objectIDs);
      const objectIds = response.objectIDs;
      this.objects = objectIds.slice(0, 11);
      // this.objects = response.objectIDs;
      // console.log(this.objects);
    });
  }
}
