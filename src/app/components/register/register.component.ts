import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '../../common/shared/shared.module';
import { SwalService } from '../../services/swal.service';
import { ValidDirective } from '../../common/directives/valid.directive';
import { ValidationMessages } from '../../common/constants/validationMessages';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, ValidDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
identityNumber: any;
birthDate: any;
bloodType: any;
gender: any;
  ngOnInit(): void {
    this.createRegisterForm();
  }

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private swal: SwalService,
    private router: Router,
  ) {}

  registerForm!: FormGroup;
  validationMessages: ValidationMessages = new ValidationMessages();

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }


  createRegisterForm() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        phoneNumber: ['', [Validators.required, this.phoneNumberValidator()]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
          ],
        ],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(formGroup: FormGroup): any {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ match: true });
    } else {
      return null;
    }
  }

  register() {
    if (this.registerForm.valid) {
      this.http
        .post('Auth/UserRegister', this.registerForm.value)
        .subscribe((res) => {
          this.swal.callToast('Kayıt işlemi başarılı!');
          this.router.navigateByUrl('');
        });
    }
  }
  phoneNumberValidator(): ValidatorFn {
    const phoneNumberRegex = /^\+?\d{10,15}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = phoneNumberRegex.test(control.value);
      return valid
        ? null
        : {
            phoneNumber: {
              valid: false,
              message: "'Telefon Numarası' geçerli bir numara olmalıdır.",
            },
          };
    };
  }
}
