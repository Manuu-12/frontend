import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from '../services/seguridadService/seguridadService';

@Injectable({
  providedIn: 'root'
})
export class NonAuthenticatedGuard implements CanActivate {
  // ¡Correcto: Inyecta el Router aquí!
  constructor(
    private seguridadService: SeguridadService,
    private router: Router // <--- ¡Añade esto!
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.seguridadService.existSession) {
      this.router.navigate(["/chats/list"]); 
      return false;
    } else {
      return true;
    }
  }
}
