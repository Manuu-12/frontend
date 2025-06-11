// src/app/core/services/machineryTrackingService/machinery-tracking.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // <-- Asegúrate de que esto esté aquí
})
export class MachineTrackingService {
  private machineCallCountSubject = new BehaviorSubject<number>(0);
  machineCallCount$ = this.machineCallCountSubject.asObservable();

  constructor() {
    const storedCount = localStorage.getItem('machineApiCallCount');
    if (storedCount) {
      this.machineCallCountSubject.next(parseInt(storedCount, 10));
      console.log('[Service Debug] Initial count from localStorage:', parseInt(storedCount, 10));
    } else {
      console.log('[Service Debug] Initial count from localStorage: 0');
    }
  }

  incrementMachineCallCount() {
    let currentCount = this.machineCallCountSubject.value;
    currentCount++;
    this.machineCallCountSubject.next(currentCount);
    localStorage.setItem('machineApiCallCount', currentCount.toString());
    console.log(`[Service Debug] Counter incremented to: ${currentCount}`); // <-- Agrega este log para confirmar
  }

  resetMachineCallCount() {
    this.machineCallCountSubject.next(0);
    localStorage.removeItem('machineApiCallCount');
    console.log('[Service Debug] Counter reset.');
  }
}