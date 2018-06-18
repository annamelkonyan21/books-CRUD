import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Facebook , FacebookLoginResponse } from "@ionic-native/facebook";
import { HomeProvider} from "../../providers/home/home";

@Component({

    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [HomeProvider]
})

export class HomePage {

    public nav: string = 'login';
    private day: string;
    userData = null;
    public errorMessages: boolean = false;
    public passwordError = false;
    public acceptUsername = false;
    public message = '';
    public messageRegistration = '';

    // login variables

    public loginForm: FormGroup;
    public email: FormControl;
    public password: FormControl;

    // registration variables
    public registrationForm : FormGroup;
    public name: FormControl;
    public last_name: FormControl;
    public remail: FormControl;
    public username: FormControl;
    public rpassword: FormControl;
    public password_confirmation: FormControl;
    public birthday: FormControl;
    public gender: FormControl;

    constructor(public navCtrl: NavController,
                private home: HomeProvider,
                private facebook: Facebook,
                private loadingCtrl: LoadingController) {
        this.createLoginFormControl();
        this.createLoginForm();
        this.createRegistrationFormControls();
        this.createRegistrationForm();
    }

    ionViewDidLoad() { }

    setValue(nav) {
        this.nav = nav;
    }

    // Login
    createLoginForm() {
        this.loginForm = new FormGroup({
            email: this.email,
            password: this.password
        });
    }

    createLoginFormControl() {
        this.email = new FormControl('',[
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
        ]);
        this.password = new FormControl('', [
            Validators.required,
        ]);
    }

    login() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        this.home.login(this.loginForm.value['email'], this.loginForm.value['password'])
            .subscribe(
                res =>  {
                    if(res) {
                        loading.dismiss();
                        this.navCtrl.setRoot('MenuPage')
                    }
                },
                error => {
                    loading.dismiss();
                    this.message = error['error']['message'];
                }
            )

    }

    loginFacebook() {
        this.facebook.login(['email', 'public_profile'])
            .then((response: FacebookLoginResponse) => {
                this.facebook.api('me?fields=id,last_name,email,first_name,birthday,gender',[])
                    .then((profile)=> {console.log(profile);this.userData = {email: profile['email'], first_name: profile['first_name']}; console.log(this.userData)})
            } )
    }

    // Registration

    createRegistrationFormControls() {
        this.name = new FormControl('', [
            Validators.required,
            Validators.pattern(/[A-Za-z]{3,5}$/),
            Validators.minLength(3),
            Validators.maxLength(15),
        ]);
        this.last_name = new FormControl('', [
            Validators.required,
            Validators.pattern(/[A-Za-z]{3,5}$/),
            Validators.minLength(3),
            Validators.maxLength(15),
        ]);
        this.remail = new FormControl('', [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
        ]);
        this.username = new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]);
        this.rpassword = new FormControl('', [
            Validators.required,
            Validators.minLength(8)],);
        this.password_confirmation = new FormControl('', [
            Validators.required,
            Validators.minLength(8)]);
        this.gender = new FormControl('');
        this.password_confirmation = new FormControl('', [
            Validators.required,
            Validators.minLength(8),
        ]);
        this.gender = new FormControl('');
        this.birthday = new FormControl('');
    }

    createRegistrationForm() {
        this.registrationForm = new FormGroup({
            birthday: this.birthday,
            name: this.name,
            last_name: this.last_name,
            remail: this.remail,
            rpassword: this.rpassword,
            password_confirmation: this.password_confirmation,
            username: this.username,
            gender: this.gender,
            day: new FormControl(),
            month: new FormControl(),
            year: new FormControl(),
        });
    }

    signup() {
        this.day = this.registrationForm.value['birthday'];
        this.day = this.day[8]+this.day[9]+'/'+this.day[5]+this.day[6]+'/'+this.day[0]+this.day[1]+this.day[2]+this.day[3];
        if (this.registrationForm.value['rpassword'] !== this.registrationForm.value['password_confirmation'] || (this.registrationForm.value['rpassword'] === 0 && this.registrationForm.value['password_confirmation']) === 0) {
            this.errorMessages = true;
            this.passwordError = true;
            return;
        }
        const controls = this.registrationForm.controls;
        if (this.registrationForm.invalid) {
            this.errorMessages = true;
            Object.keys(controls)
                .forEach(controlName => controls[controlName].markAsTouched());
            return;
        }
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        this.home.signup(this.registrationForm.value['name'], this.registrationForm.value['last_name'], this.registrationForm.value['username'],  this.registrationForm.value['remail'], this.registrationForm.value['rpassword'], this.registrationForm.value['password_confirmation'], this.day, this.registrationForm.value['gender'])
            .subscribe(res => {
                    loading.dismiss();
                    this.navCtrl.setRoot('MenuPage');
                },
                error => {
                    loading.dismiss();

                    this.messageRegistration = JSON.parse(error['error']['message']);
                    this.messageRegistration = this.messageRegistration['email'][0];
                }
            )
    }

    onBlur() {
        this.errorMessages = true;
    }

    onKeyDown() {
        this.errorMessages = false;
    }

    onChange(e){
        console.log(e);
    }


}