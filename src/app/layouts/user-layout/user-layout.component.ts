import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLayoutComponent implements OnInit {
  isCompleted = false;
  selectBackgroundColor = 'white';

  constructor(
    private http: HttpService,
  ) { }

  ngOnInit(): void {
  }

  onStatusChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.isCompleted = selectElement.value === '3';


    switch (selectedValue) {
      case '1':
        this.selectBackgroundColor = 'green';
        break;
      case '2':
        this.selectBackgroundColor = 'yellow';
        break;
      case '3':
        this.selectBackgroundColor = 'red';
        break;
      default:
        this.selectBackgroundColor = 'orange';
    }

  }

  putUpdateTaskStatus(){
    this.http
      .put<any>('Task/UpdateTaskStatus')
      .subscribe(response => {
        // handle the response
      });
  }

}
