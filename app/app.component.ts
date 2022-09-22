import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable }    from 'rxjs/Observable';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  test: string = "prove something";

  loginForm: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';

  constructor(private formBuilder: FormBuilder) { }
  
  ngOnInit() {
    this.createForm();
    this.setChangeValidate()
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.loginForm = new FormGroup({
      email: new FormControl(null, {
      validators: [Validators.required, Validators.pattern(emailregex)], 
      asyncValidators: [this.checkInUseEmail],
      updateOn: 'blur'
    }),
      name: new FormControl(null, {
      validators: Validators.required
    }),
      password: new FormControl(null, {
      validators: [Validators.required, this.checkPassword]
    }),
      description: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(10)]
    }),
      validate: new FormControl()
    });
  }

  setChangeValidate () {
    this.loginForm.get('validate').valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.loginForm.get('name').setValidators([Validators.required, Validators.minLength(3)]);
          this.titleAlert = "You need to specify at least 3 characters";
        } else {
          this.loginForm.get('name').setValidators(Validators.required);
        }
        this.loginForm.get('name').updateValueAndValidity();
      }
    )
  }

  get name() {
    return this.loginForm.get('name') as FormControl
  }

  checkPassword(control) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? {'requirements': true} : null;
  }

  checkInUseEmail(control) {
    // mimic http database access
    console.log('Call to checkInUseEmail');
    console.log(this.test);
    let db = ['tony@gmail.com'];
    return new Observable(observer => {
      setTimeout( () => {
        let result = (db.indexOf(control.value) !== -1) ? {'alreadyInUse': true} : null;
        observer.next(result);
        observer.complete();
      }, 4000)
    })
  }

  getErrorEmail() {
    return this.loginForm.get('email').hasError('required') ? 'Field is required' :
           this.loginForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
           this.loginForm.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorPassword() {
    return this.loginForm.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' : 
           this.loginForm.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }

  onSubmit(post) {
    this.post = post;
  }

}
