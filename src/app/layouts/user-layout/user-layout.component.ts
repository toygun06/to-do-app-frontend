import { TaskModel } from './../../models/taskModel';
import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Paginate } from '../../models/paginateModel';
import { LocalStorageService } from '../../services/local-storage.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalService } from '../../services/swal.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
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
  tasks:Paginate<TaskModel>;


  constructor(
    private http: HttpService,
    private localStorage: LocalStorageService,
    private AuthService: AuthService,
    private fb: FormBuilder,
    private swal: SwalService,
    private cdRef: ChangeDetectorRef,
  ) { }

  filteredTasks: TaskModel[] = [];
  selectedFilter: string = null;
  selectedSort = '0';

  ngOnInit(): void {
    this.getTasks();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      userId: [null],

    });
    // this.applyFilter();
  }

  // applyFilter() {
  //   if (!this.tasks || !this.tasks.items) {
  //     return;
  //   }

  //   this.filteredTasks = this.tasks.items.filter(task => {
  //     if (this.selectedFilter === '0') return true; // Tümü
  //     if (this.selectedFilter === '1') return task.status === 1; // Yeni
  //     if (this.selectedFilter === '2') return task.status === 2; // Yapılıyor
  //     if (this.selectedFilter === '3') return task.status === 3; // Tamamlanmış
  //     return true;
  //   });

  //   this.cdRef.detectChanges(); // Değişiklikleri tetikle
  // }



  addTask() {
    const userId = this.AuthService.getUserId();
    this.taskForm.patchValue({ userId: userId });
    if (this.taskForm.valid) {
      this.http.post(`Task/Add`, this.taskForm.value).subscribe(response => {
        this.swal.callToast("Görev başarıyla eklendi", "success");
        this.getTasks();
        this.taskForm.reset();
      }, error => {
        console.error('Hata:', error);
      });
    }
  }

  putUpdateTaskStatus(taskId: number, status: number) {
    const model = {
      id: taskId,
      status: status
    };

    this.http
      .put<any>(`Task/UpdateTaskStatus`, model)
      .subscribe(response => {
        this.swal.callToast("Görev başarıyla güncellendi", "success");
      });
      this.getTasks();
  }

  updateTask(task: TaskModel) {

    this.http.put(`Task/Update`, task)
    .subscribe(response => {
      const index = this.tasks.items.findIndex(t => t.id === task.id);
      this.tasks.items[index] = task;
    });
  }

  deleteTask(taskId: number) {
    this.swal.callSwal("Görev Silme", "Görevi silmek istediğinize emin misiniz?", ()=> {
      this.http.delete(`Task/Delete?id=${taskId}`)
      .subscribe(response => {
        this.getTasks();
        this.swal.callToast("Görev başarıyla silindi", "success");
      });
    }, "Evet")
    };

    onFilterChange() {
      this.pageIndex = 1; // Filtre değiştiğinde pageIndex 1'e ayarlanıyor
      this.getTasks();    // Yeni filtreye göre görevleri getir
    }

  getTasks(){
    const userId = this.AuthService.getUserId();

    let params = new HttpParams()
    .set('UserId', userId.toString())
    .set('PageIndex', this.pageIndex.toString())
    .set('PageSize', this.pageSize.toString());

  // Eğer filter null değilse TStatus parametresine ekle
  if (this.selectedFilter !== null) {
    params = params.set('TStatus', this.selectedFilter.toString());
  }

    this.http
    .get<Paginate<TaskModel>>(`Task/GetPaginatedTaskByUserId`, params)
      .subscribe(response => {
        this.tasks = response;
        this.totalPages = response.pagination.totalPages;
        // this.applyFilter();
        this.pageIndex = response.pagination.pageIndex;
      },
      error => {
        console.error('Hata:', error);
        this.swal.callToast("Görevler getirilirken hata oluştu", "error");
      }
    );
  }

// ?UserId=${userId}&PageIndex=${this.pageIndex}&pageSize=${this.pageSize}&TStatus=${filter}`

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
