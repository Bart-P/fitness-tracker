import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {Store} from "@ngrx/store";
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavCloseEmitter = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(private authService: AuthService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  sidenavClose() {
    this.sidenavCloseEmitter.emit();
  }

  logout() {
    this.authService.logout();
    this.sidenavClose();
  }
}
