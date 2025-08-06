import { Component, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonThumbnail,
  IonCol,
  IonCard,
  IonSkeletonText,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCardTitle,
  IonCardSubtitle,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonBackButton,
  IonButton,
} from '@ionic/angular/standalone';
import { PaintingCardComponent } from 'src/app/components/painting-card/painting-card.component';

@Component({
  selector: 'app-department-objects',
  templateUrl: './department-objects.page.html',
  styleUrls: ['./department-objects.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonBackButton,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonThumbnail,
    IonCardSubtitle,
    IonCardTitle,
    IonRow,
    IonGrid,
    IonCardHeader,
    IonSkeletonText,
    IonCard,
    IonCol,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    PaintingCardComponent,
  ],
})
export class DepartmentObjectsPage implements OnInit {
  readonly infiniteScroll = viewChild.required(IonInfiniteScroll);
  hiddenObjectIds = new Set<number>();
  departmentName!: string;
  allObjectIds: number[] = [];
  objects: any[] = [];
  isLoading = false;
  loadedCount = 0;
  readonly BATCH_SIZE = 5;
  isLoadingMore = false;
  departmentObject!: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      const departmentObject = navigation.extras.state;
      // Use extraData here
      console.log('Extra data:', departmentObject['department']);
      if (departmentObject['department']) {
        this.departmentName = departmentObject['department'].displayName;
        // Fetch objects for this department
        this.api
          .getAllPaintingObjects(
            this.departmentName,
            true,
            departmentObject['department'].departmentId
          )
          .subscribe({
            next: (response) => {
              const ids = response.objectIDs || [];
              this.allObjectIds = ids;
              this.objects = [];
              this.loadedCount = 0;
              this.loadMore();
              this.isLoading = false;
            },
            error: () => {
              this.objects = [];
              this.isLoading = false;
            },
          });
      }
    }
    // this.route.paramMap.subscribe((params) => {
    //   console.log('DepartmentObjectsPage: ngOnInit', params);
    //   const departmentName = params.get('departmentName');

    //   if (departmentName) {
    //     this.departmentName = departmentName;
    //     // Fetch objects for this department
    //     this.api.getAllPaintingObjects(undefined, true).subscribe({
    //       next: (response) => {
    //         const ids = response.objectIDs || [];
    //         this.allObjectIds = ids;
    //         this.objects = [];
    //         this.loadedCount = 0;
    //         this.loadMore();
    //         this.isLoading = false;
    //       },
    //       error: () => {
    //         this.objects = [];
    //         this.isLoading = false;
    //       },
    //     });
    //   }
    // });
  }

  /**
   * Loads the next batch of painting objects into the view.
   * Disables infinite scroll if all items are loaded.
   * @param event The infinite scroll event (IonInfiniteScrollCustomEvent)
   */
  loadMore(event?: CustomEvent) {
    // Prevent concurrent loadMore calls
    if (this.isLoadingMore) {
      if (event && event.target) {
        (event.target as HTMLIonInfiniteScrollElement).complete();
      }
      return;
    }
    this.isLoadingMore = true;

    // Prevent further loading if all items are already loaded
    if (this.loadedCount >= this.allObjectIds.length) {
      const infiniteScroll = this.infiniteScroll();
      if (infiniteScroll) {
        infiniteScroll.disabled = true;
      }
      if (event && event.target) {
        (event.target as HTMLIonInfiniteScrollElement).complete();
      }
      this.isLoadingMore = false;
      return;
    }

    // Load the next batch
    const nextBatch = this.allObjectIds.slice(
      this.loadedCount,
      this.loadedCount + this.BATCH_SIZE
    );
    this.objects = this.objects.concat(nextBatch);
    this.loadedCount += nextBatch.length;

    // If all items are loaded, disable infinite scroll
    const infiniteScroll = this.infiniteScroll();
    if (this.loadedCount >= this.allObjectIds.length && infiniteScroll) {
      infiniteScroll.disabled = true;
    }

    // Complete the infinite scroll event
    if (event && event.target) {
      (event.target as HTMLIonInfiniteScrollElement).complete();
    }

    // Allow next loadMore
    setTimeout(() => {
      this.isLoadingMore = false;
    }, 500); // Small delay to avoid rapid retrigger
  }

  onPaintingCardDestroyed(objectId: number) {
    this.hiddenObjectIds.add(objectId);
  }

  get visiblePaintingCards(): number {
    return this.objects.filter((item) => !this.hiddenObjectIds.has(item))
      .length;
  }
}
