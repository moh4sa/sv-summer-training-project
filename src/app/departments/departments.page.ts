import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.page.html',
  styleUrls: ['./departments.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
  ],
})
export class DepartmentsPage implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  departments: any[] = [];

  ngOnInit() {
    this.api.getDepartments().subscribe({
      next: (data) => {
        this.departments = data.departments;
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
      },
    });
  }

  goToDepartment(department: any) {
    this.router.navigate(['/department-objects'], { state: { department } });
  }
}
