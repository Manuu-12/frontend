import { environment } from 'src/environments/environment';
import { SeguridadService } from './seguridadService/seguridadService';
import { EventEmitter, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends Socket {

  callback: EventEmitter<any> = new EventEmitter();
  nameEvent: string;

  constructor(private seguridadService: SeguridadService) {

    const userId = seguridadService.usuarioSesionActiva?.email || '';

    super({
      url: environment.url_ms_cinema,
      options: {
        query: {
          "user_id": userId
        }
      }

    })


    this.nameEvent = ""

    //this.listen()

  }

  setNameEvent(nameEvent: string) {

    this.nameEvent = nameEvent

    this.listen()

  }

  listen = () => {

    this.ioSocket.on(this.nameEvent, (res: any) => this.callback.emit(res))

  }

  // Para llamar este método es necesario inyectar el servicio

  // y enviar el payload

  // emitEvent=(payload={})=>{

  // this.ioSocket.emit(this.nameEvent,payload)


}
