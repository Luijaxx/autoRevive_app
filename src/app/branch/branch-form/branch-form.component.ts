import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { NotificacionService, TipoMessage } from '../../share/notification.service';
import { FormErrorMessage } from '../../form-error-message';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.css']
})
export class BranchFormComponent implements OnInit, OnDestroy {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Create';
  branchForm: FormGroup;
  idBranch: number = 0;
  isCreate: boolean = true;
  userList: any[] = [];
  filteredUsers: any[] = [];
  branchInfo: any;
  listUsersobj: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.formularioReactive();
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.idBranch = parseInt(params['id']);
      if (this.idBranch) {
        this.isCreate = false;
        this.titleForm = 'Update';
        this.gService
          .get('branch', this.idBranch)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.branchInfo = data;
            this.branchForm.patchValue({
              id: parseInt(this.branchInfo.id),
              name: this.branchInfo.name,
              description: this.branchInfo.description,
              phoneNumber: this.branchInfo.phoneNumber,
              exactAddress: this.branchInfo.exactAddress,
              email: this.branchInfo.email
            });
            this.populateUsers(this.branchInfo.users);
          });
      } else {
        this.listUsers();
      }
    });
  }

  formularioReactive() {
    this.branchForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      description: [null, Validators.required],
      phoneNumber: [null, [Validators.required, this.numericValidator()]], // Add custom validator here
      exactAddress: [null, Validators.required],
      email: [null, Validators.required],
      users: [[], Validators.required]
    });
  }

  numericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = /^[0-9]+$/.test(control.value);
      return isValid ? null : { 'numeric': true };
    };
  }

  listUsers() {
    this.gService
      .list('user')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.userList = data.filter(user => user.role === 'MANAGER');
        if (this.idBranch) {
          this.filteredUsers = this.userList.filter(user => parseInt(user.branchId) === this.idBranch || user.branchId === null);
        } else {
          this.filteredUsers = this.userList.filter(user => user.branchId === null);
        }
        console.log(this.filteredUsers);
      });
  }

  populateUsers(users: any[]) {
    const usersControl = this.branchForm.get('users');
    if (usersControl) {
      const userIds = users.map(user => user.id);
      usersControl.setValue(userIds);
      this.listUsers();
    }
  }

  logFormErrors() {
    const controls = this.branchForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(`Control: ${name}`);
        console.log(`Errors: ${JSON.stringify(controls[name].errors)}`);
      }
    }
  }

  submitBranch() {
    if (this.branchForm.invalid) {
      this.logFormErrors(); // Log errors to the console
      return;
    }

    const branchData = this.branchForm.value;

    // Log branchData to verify
    console.log('Branch Data before sending:', branchData);

    if (this.isCreate) {
      this.gService.create('branch', branchData).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.noti.mensajeRedirect(
          'Create Branch',
          `Branch created: ${data.id}`,
          TipoMessage.success,
          'branch-table'
        );
        this.router.navigate(['/branch-table']);
      });
    } else {
      this.gService.update('branch', branchData).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.noti.mensajeRedirect(
          'Update Branch',
          `Branch updated: ${data.id}`,
          TipoMessage.success,
          'branch-table'
        );
        this.router.navigate(['/branch-table']);
      });
    }
  }

  onReset() {
    this.branchForm.reset();
  }

  onBack() {
    this.router.navigate(['/branch-table']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  errorHandling(controlName: string) {
    const control = this.branchForm.get(controlName);
    if (control && control.errors) {
      for (const message of FormErrorMessage) {
        if (control.errors[message.forValidator] && message.forControl === controlName) {
          return message.text;
        }
      }
    }
    return false;
  }
}
