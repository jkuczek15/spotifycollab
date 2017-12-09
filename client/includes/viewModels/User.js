// Create custom view models for our different forms
export function Register () {
    this.username = "";
    this.email = "";
    this.password = "";
    this.confirm_password = "";
};// end interface class Register

export function Login () {
    this.email = "";
    this.password = "";
};// end interface class Login

export function Profile () {
    this.email = "";
    this.password = "";
    this.created = "";
};// end interface class Profile