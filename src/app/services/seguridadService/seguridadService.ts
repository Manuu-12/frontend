import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';

interface RespuestaLogin {
  token?: string;
  requiresTwoFactor?: boolean;
  user?: {
    _id: string;
    name?: string;
    email?: string;
  };
  message?: string;
  error?: any;
  twoFactorCode?: string; // Agregado para manejar el código 2FA
}

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class SeguridadService {
  private usuarioSubject = new BehaviorSubject<Usuario>(new Usuario());

  constructor(private http: HttpClient, private router: Router) {
    this.verificarSesionActual();
  }

  existSession(): boolean {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        return !!parsedData.token;
      } catch (e) {
        console.error('Error al parsear userSession:', e);
        return false;
      }
    }
    return false;
  }

  // Primera fase de login con email y password
  login(email: string, password: string): Observable<RespuestaLogin> {
    return this.http.post<any>(`${environment.ms_security}/api/public/security/login`, {
      email,
      password
    }).pipe(
      map(response => {
        // Si la respuesta es un string, intentamos parsearlo
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch (e) {
            throw new Error('Formato de respuesta inválido');
          }
        }
        return response;
      }),
      catchError(error => {
        if (error.status === 500) {
          throw new Error('Error interno del servidor. Por favor, intente más tarde.');
        } else if (error.status === 400) {
          throw new Error('Datos de inicio de sesión inválidos. Por favor, revise su correo y contraseña.');
        } else {
          throw new Error('Ocurrió un error inesperado. Por favor, intente más tarde.');
        }
      })
    );
  }

  // Segunda fase de login con código 2FA
  validateTwoFactor(code2FA: string): Observable<RespuestaLogin> {
    return this.http.post<any>(`${environment.ms_security}/api/public/security/login/validate/${code2FA}`, {}).pipe(
      map(response => {
        console.log('Respuesta 2FA:', response);
        let parsedResponse: RespuestaLogin;

        // Si la respuesta es un string (token), la formateamos
        if (typeof response === 'string') {
          parsedResponse = {
            token: response
          };
        } else {
          parsedResponse = response;
        }

        // Si tenemos un token, guardamos la sesión
        if (parsedResponse.token) {
          this.guardarDatosSesion(parsedResponse);
        }

        return parsedResponse;
      }),
      catchError(error => {
        console.error('Error en validateTwoFactor:', error);
        throw error;
      })
    );
  }

  validateTwoFactorCode(twoFactorCode: string): Observable<any> {
    return this.http.post<any>(`${environment.ms_security}/api/public/security/login/validate/${twoFactorCode}`, {}).pipe(
      map(response => {
        if (response.token) {
          localStorage.setItem('userSession', JSON.stringify(response));
          this.usuarioSubject.next(response.user);
          this.router.navigate(["dashboard"]); // Redirigir al tablero principal
        }
        return response;
      }),
      catchError(error => {
        console.error('Error en la validación del código de dos factores:', error);
        throw error;
      })
    );
  }

  public get usuarioSesionActiva(): Usuario {
    return this.usuarioSubject.value;
  }

  setUsuario(user: Usuario) {
    this.usuarioSubject.next(user);
  }

  getUsuario() {
    return this.usuarioSubject.asObservable();
  }

  guardarDatosSesion(datosSesion: RespuestaLogin) {
    try {
      console.log('Datos de sesión recibidos:', datosSesion);
      if (!datosSesion.token) {
        console.error('No se recibió el token de autenticación en los datos de sesión:', datosSesion);
        throw new Error('No se recibió el token de autenticación');
      }

      // Crear un nuevo objeto Usuario con los datos de la sesión
      const usuarioData = new Usuario();
      usuarioData.token = datosSesion.token;
      usuarioData._id = datosSesion.user?._id || '';
      usuarioData.email = datosSesion.user?.email || '';
      usuarioData.nombre = datosSesion.user?.name || '';

      localStorage.setItem('sesion', JSON.stringify(usuarioData));
      this.setUsuario(usuarioData);
    } catch (error) {
      console.error('Error al guardar datos de sesión:', error);
      throw error;
    }
  }

  saveSession(data: RespuestaLogin): void {
    this.guardarDatosSesion(data);
  }

  logout() {
    localStorage.removeItem('sesion');
    this.setUsuario(new Usuario());
  }

  verificarSesionActual() {
    const sesionActual = this.getDatosSesion();
    if (sesionActual) {
      try {
        const datosUsuario = JSON.parse(sesionActual);
        if (datosUsuario && datosUsuario.token) {
          this.setUsuario(datosUsuario);
        }
      } catch (error) {
        console.error('Error al parsear datos de sesión:', error);
        this.logout(); // Limpia la sesión si hay error
      }
    }
  }

  sesionExiste(): boolean {
    let sesionActual = this.getDatosSesion();
    return (sesionActual) ? true : false;
  }

  getDatosSesion() {
    let sesionActual = localStorage.getItem('sesion');
    return sesionActual;
  }
}