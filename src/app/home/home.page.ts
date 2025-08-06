import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonIcon,
  IonCardContent,
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { PaintingCardComponent } from '../components/painting-card/painting-card.component';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { search, searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonIcon,
    IonSearchbar,
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
})
export class HomePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  // Holds the currently loaded painting objects
  objects: any[] = [];
  // Holds all painting object IDs returned from the API
  allObjectIds: any[] = [];
  // Number of objects to load per batch (configurable)
  readonly BATCH_SIZE = 5;
  loadedCount = 0;
  private api = inject(ApiService);
  private loadingService = inject(LoadingService);
  // Flag to prevent concurrent loadMore calls
  private isLoadingMore = false;
  // Flag to indicate if API is loading (for skeleton UI)
  isLoading = false;

  constructor() {
    addIcons({ searchOutline });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.api
      .getAllPaintingObjects()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.allObjectIds = response.objectIDs || [];
          this.objects = [];
          this.loadedCount = 0;
          this.loadMore();
        },
        error: (err) => {
          // TODO: Show user-friendly error message
          console.error('Failed to load painting objects', err);
        },
      });
  }

  handleInput(event: Event) {
    // Use proper type for IonSearchbar event
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.isLoading = true;
    this.loadingService.presentLoading();
    this.api
      .getAllPaintingObjects(query)
      .pipe(
        // Always dismiss loading, even on error
        finalize(() => {
          this.isLoading = false;
          this.loadingService.dismissLoading();
        })
      )
      .subscribe({
        next: (response) => {
          this.allObjectIds = response.objectIDs || [];
          this.objects = [];
          this.loadedCount = 0;
          // Reset infinite scroll state if needed
          if (this.infiniteScroll) {
            this.infiniteScroll.disabled = false;
          }
          this.loadMore();
        },
        error: (err) => {
          // TODO: Show user-friendly error message
          console.error('Failed to search painting objects', err);
        },
      });
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
      if (this.infiniteScroll) {
        this.infiniteScroll.disabled = true;
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
    if (this.loadedCount >= this.allObjectIds.length && this.infiniteScroll) {
      this.infiniteScroll.disabled = true;
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
}
