import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class UserLayoutComponent { }
