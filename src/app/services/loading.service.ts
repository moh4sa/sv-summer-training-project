import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingController = inject(LoadingController);
  /** flag is used to the check loading indicator current status */
  isLoading = false;

  /**
   * show loading indicator
   * @returns void
   */
  async presentLoading() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      mode: 'md',
      spinner: 'crescent',
      cssClass: 'loading',
      translucent: true,
      backdropDismiss: false,
      showBackdrop: true,
      animated: true,
    });
    await loading.present();
  }

  /**
   * dismiss loading indicator
   * @returns void
   */
  async dismissLoading() {
    this.isLoading = false;
    await this.loadingController.dismiss();
  }
}
