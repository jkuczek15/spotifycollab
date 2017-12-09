import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { EqualValidator } from '../directives/equal-validator.directive';

@NgModule({
  imports:      [ CommonModule],
  declarations: [ EqualValidator],
  exports:      [ EqualValidator, CommonModule ]
})
export class FormValidator {

    constructor() { }

    // Shared validation messages among forms
    public validationMessages: any = {
        'username': {
          'required':   'Display name is a required field.',
          'minlength':  'Display name must be at least 4 characters.',
          'maxlength':  'Display name cannot be longer than 24 characters.',
          'pattern':    'Display name is invalid.',
        },
        'email': {
          'required':   'Email address is a required field.',
          'pattern':    'Email address is invalid.'
        },
        'password': {
          'required':   'Password is a required field.'
        },
        'confirm_password': {
          'required':   'Confirmation password is a required field.',
          'validateEqual': 'Confirmation password must match original password.'
        },
        'auth_required' : 'Login is required before proceeding.'
    };

    // Shared regex patterns among forms
    public patterns: any = {
      'username': '^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*([a-zA-Z0-9])*$',
      'email': /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    };

    // Shared 'onValueChanged' function for executing code each time form input changes
    public onValueChanged(component, formKey, top?, data?: any) {
      if (!component[formKey]) { return; }
      const form = component[formKey];
      
      if(top) {
         // reset the components top-level form error
        component.formErrors['top'] = '';
      }// end if we need to reset the components top form error
     
      for (let field in component.formErrors) {
        // Clear previous error message (if any)
        if(!top) {
          component.formErrors[field] = '';
        }// end if not displaying top errors
        
        // grab our form control object
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          
          // check if we should display errors on top of the form
          if(top) {
            field = 'top';
          }// end if we need to set the top-level error

          if(Object.keys(control.errors).length >= 1) {
            // there is only one error, dont make a list, just grab the 1st key
            component.formErrors[field] = messages[Object.keys(control.errors)[0]];
          }// end if we have at least one form error, display it
          
        }// end if the field has been modified and invalid

      }// end for loop over all form errors

    }// end onValueChanged function

 }// end class FormValidator