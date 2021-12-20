import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TrainingService} from "../training/training.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;

  constructor(private router: Router,
              private angularFireAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private snackBar: MatSnackBar
  ) {
  }

  initAuthListener() {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']).then(() => console.log('logged in successfully!'));
      } else {
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.trainingService.cancelSubscriptions();
        this.router.navigate(['/login']).then(() => console.log('user logged out!'));
      }
    });
  }

  registerUser(authData: AuthData) {
    this.angularFireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .catch(error => {
        this.snackBar.open(error.message, null, {
          duration: 5000
        });
      })
  }

  login(authData: AuthData): void {
    this.angularFireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .catch(error => {
        this.snackBar.open(error.message, null, {
          duration: 5000
        });
      })
  }

  logout(): void {
    this.angularFireAuth.signOut!()
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }
}
