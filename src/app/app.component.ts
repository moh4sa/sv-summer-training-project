import { Component, inject } from '@angular/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private platform = inject(Platform);
  constructor() {
    if (this.platform.is('capacitor')) {
      this.lockScreenOnPortrait();
    }
  }

  /**
   * function to lock screen orientation on portrait using native plugin
   * @returns {void}
   */
  async lockScreenOnPortrait(): Promise<void> {
    await ScreenOrientation.lock({ orientation: 'portrait' });
  }
}
