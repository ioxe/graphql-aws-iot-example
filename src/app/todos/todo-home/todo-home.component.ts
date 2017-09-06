import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-todo-home',
    templateUrl: 'todo-home.component.html'
})
export class TodoHomeComponent {
    selectTeamForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        public router: Router
    ) {
        this.selectTeamForm = this.fb.group({
            teamName: ['', Validators.required]
        });
    }
    onSubmit() {
        if (this.selectTeamForm.valid) {
            this.router.navigate(['./team', this.selectTeamForm.value.teamName]);
         }
    }
}
