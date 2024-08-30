import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Paginate } from '../../models/paginateModel';
import { LocalStorageService } from '../../services/local-storage.service';
import { TaskModel } from '../../models/taskModel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserLayoutComponent implements OnInit {
  taskForm: FormGroup;
  isCompleted = false;
  selectBackgroundColor = 'white';
  getUserId: any;

  constructor(
    private http: HttpService,
    private localStorage: LocalStorageService,
    private AuthService: AuthService,
    private fb: FormBuilder,
    private swal: SwalService,
    private cdRef: ChangeDetectorRef,
  ) { }

  tasks:Paginate<TaskModel>;

  ngOnInit(): void {
    this.getTasks();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      userId: [null],

    });
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



  addTask() {
    const userId = this.AuthService.getUserId();
    this.taskForm.patchValue({ userId: userId });
    if (this.taskForm.valid) {
      // API POST isteği
      this.http.post(`Task/Add`, this.taskForm.value).subscribe(response => {
        this.swal.callToast("Görev başarıyla eklendi", "success");
        this.getTasks();
        this.taskForm.reset();
      }, error => {
        console.error('Hata:', error);
      });
    }
  }

  get title() {
    return this.taskForm.get('title');
  }
  get description() {
    return this.taskForm.get('description');
  }

  putUpdateTaskStatus(){
    this.http
      .put<any>('Task/UpdateTaskStatus')
      .subscribe(response => {
        // handle the response
      });
  }

  updateTask(task: TaskModel) {

    this.http.put(`Task/Update`, task).subscribe(response => {
      const index = this.tasks.items.findIndex(t => t.id === task.id);
      this.tasks.items[index] = task;
    });
  }

  deleteTask(taskId: number) {
    this.swal.callSwal("Görev Silme", "Görevi silmek istediğinize emin misiniz?", ()=> {
      this.http.delete(`Task/Delete?id=${taskId}`).subscribe(response => {
        this.getTasks();
        this.swal.callToast("Görev başarıyla silindi", "success");
      });
    }, "Evet")
    };


  getTasks(){
    const userId = this.AuthService.getUserId();
    this.http
    .get<Paginate<TaskModel>>(`Task/GetPaginatedTaskByUserId?UserId=${userId}&PageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
      .subscribe(response => {
        this.tasks = response;
        this.totalPages = response.pagination.totalPages;
      },
      error => {
        console.error('Hata:', error);
        this.swal.callToast("Görevler getirilirken hata oluştu", "error");
      }
    );
  }


//Pagination
pageSize: number = 10;

// Mevcut sayfa numarası
pageIndex: number = 1;

// Toplam sayfa sayısı
totalPages: number;
// Sayfaya git
goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.pageIndex = page;
    this.getTasks();
  }
}

// Önceki sayfaya git
prevPage() {
  if (this.pageIndex > 1) {
    this.pageIndex--;
    this.getTasks();
  }
}

// Sonraki sayfaya git
nextPage() {
  if (this.pageIndex < this.totalPages) {
    this.pageIndex++;
    this.getTasks();
  }
}

// İlk sayfaya git
goToFirstPage() {
  if (this.tasks.pagination.pageIndex > 1) {
    this.pageIndex = 1;
    this.getTasks();
  }
}

// Son sayfaya git
goToLastPage() {
  if (this.totalPages > this.pageIndex) {
    this.pageIndex = this.totalPages;
    this.getTasks();
  }
}

// Sayfa numaralarını döndürür
getPageNumbers(): number[] {
  const pageNumbers = [];
  const maxPagesToShow = 10; // Sayfa numaralarının maksimum gösterileceği miktarı belirleyin
  const startPage = Math.max(
    1,
    this.pageIndex - Math.floor(maxPagesToShow / 2)
  );
  const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
}

// Kaç adet listeleneceğini belirtir
goToChangeSelectedCount() {
  this.getTasks();
}

// Başlangıç indisini hesaplar
calculateStartIndex(): number {
  return (this.pageIndex - 1) * this.pageSize + 1;
}

}
