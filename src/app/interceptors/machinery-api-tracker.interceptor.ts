  import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MachineTrackingService } from '../services/machineryTrackingService/machinery-tracking.service'; // Asegúrate que la ruta es correcta

@Injectable()
export class MachineApiTrackerInterceptor implements HttpInterceptor {

  constructor(private machineTrackingService: MachineTrackingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const machineEndpointPatterns = [
      '/maquinas', // Coincidirá con /maquinas, /maquinas/1, etc.
      '/gps'       // Coincidirá con /gps
    ];

    console.log(`[Interceptor Debug] Intercepting request to: ${request.url}`);
    console.log(`[Interceptor Debug] Request method: ${request.method}`);
    console.log(`[Interceptor Debug] Defined patterns:`, machineEndpointPatterns);

    // Ojo: request.url contiene la URL COMPLETA, incluyendo el dominio (http://localhost:3333/maquinas)
    const isMachineRelated = machineEndpointPatterns.some(pattern =>
      request.url.includes(pattern)
    );

    console.log(`[Interceptor Debug] Is machine-related? ${isMachineRelated}`);

    if (isMachineRelated) {
      this.machineTrackingService.incrementMachineCallCount();
      console.log(`[Machine API Tracker] Contador INCREMENTADO para: ${request.url}`);
    }

    return next.handle(request);
  }
}