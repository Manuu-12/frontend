// src/app/components/navbar/navbar.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES } from '../sidebar/sidebar.component'; // Asegúrate que esta ruta sea correcta

import { Usuario } from 'src/app/models/usuario.model';
import { WebSocketService } from 'src/app/services/web-socket-service.service';
import { Observable, Subscription } from 'rxjs';
import { MachineTrackingService } from 'src/app/services/machineryTrackingService/machinery-tracking.service';
import { SeguridadService } from 'src/app/services/seguridadService/seguridadService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public focus: boolean = false;
  public listTitles: any[] = [];
  public location: Location;
  public user: Usuario | null = null;
  private userSubscription: Subscription | undefined;

  public machineCallCount$!: Observable<number>;

  constructor(
    location: Location,
    private router: Router,
    private securityService: SeguridadService,
    private webSocketService: WebSocketService,
    private machineTrackingService: MachineTrackingService
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);

    this.userSubscription = this.securityService.getUsuario().subscribe(user => {
      this.user = user;
    });

    this.webSocketService.setNameEvent("notifications");
    this.webSocketService.callback.subscribe((res: any) => {
      console.log('WebSocket notification received:', res);
    });

    this.machineCallCount$ = this.machineTrackingService.machineCallCount$;

    // --- DEPURACIÓN DEL NAVBAR ---
    console.log('[Navbar Debug] Navbar component initialized.');
    this.machineCallCount$.subscribe(count => {
      console.log(`[Navbar Debug] machineCallCount$ received new value: ${count}`);
    });
    // --- FIN DEPURACIÓN ---
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getTitle(): string {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }
}