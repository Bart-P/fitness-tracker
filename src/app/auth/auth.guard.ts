import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {Observable, take} from "rxjs";
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import * as fromRoot from "../app.reducer";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router,
              private store: Store<fromRoot.State>,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }

  canLoad(route: Route) {
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }

}
