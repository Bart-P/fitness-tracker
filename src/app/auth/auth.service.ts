import {AuthData} from "./auth-data.model";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TrainingService} from "../training/training.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UIService} from "../shared/ui.service";
import {Store} from "@ngrx/store";
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from '../auth/auth.actions';

@Injectable()
export class AuthService {

  constructor(private router: Router,
              private angularFireAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private snackBar: MatSnackBar,
              private uiService: UIService,
              private store: Store<fromRoot.State>,
  ) {
  }

  initAuthListener() {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(new Auth.SetAuthenticated())
        this.router.navigate(['/training']).then(() => console.log('logged in successfully!'));
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(new Auth.SetUnAuthenticated())
        this.router.navigate(['/login']).then(() => console.log('user logged out!'));
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading())
    this.angularFireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() =>
        this.store.dispatch(new UI.StopLoading()))
      .catch(error => {
        this.store.dispatch(new UI.StopLoading())
        this.uiService.showSnackBar(error.message, null, 5000);
      })
  }

  login(authData: AuthData): void {
    this.store.dispatch(new UI.StartLoading())
    this.angularFireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() =>
        this.store.dispatch(new UI.StopLoading()))
      .catch(error => {
        this.store.dispatch(new UI.StopLoading())
        this.snackBar.open(error.message, null, {
          duration: 5000
        });
      })
  }

  logout(): void {
    this.angularFireAuth.signOut!()
  }
}
