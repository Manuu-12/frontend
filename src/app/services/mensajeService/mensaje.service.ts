import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Mensaje, UserConversation } from 'src/app/models/mensaje.model';
import { Usuario } from 'src/app/models/usuario.model';
import { environment } from 'src/environments/environment';
import { SeguridadService } from '../seguridadService/seguridadService';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  // URL base para el servicio de mensajes (AdonisJS en puerto 3333)
  private readonly mensajesApiUrl = 'http://localhost:3333/api';

  constructor(
    private http: HttpClient,
    private seguridadService: SeguridadService
  ) { }

  // Obtener user_id del SeguridadService
  getCurrentUserId(): string | null {
    try {
      const usuarioActual = this.seguridadService.usuarioSesionActiva;
      if (usuarioActual && usuarioActual._id) {
        console.log('Usuario obtenido desde SeguridadService:', usuarioActual);
        return usuarioActual._id;
      }

      const sesionData = this.seguridadService.getDatosSesion();
      if (sesionData) {
        const parsedData = JSON.parse(sesionData);
        console.log('Usuario obtenido desde localStorage:', parsedData);
        return parsedData._id || null;
      }

      console.error('No se pudo obtener el user_id de la sesión');
      return null;
    } catch (error) {
      console.error('Error al obtener user_id:', error);
      return null;
    }
  }

  getCurrentUser(): Usuario | null {
    try {
      const usuarioActual = this.seguridadService.usuarioSesionActiva;
      if (usuarioActual && usuarioActual._id) {
        return usuarioActual;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  isUserLoggedIn(): boolean {
    return this.seguridadService.sesionExiste();
  }

  // MÉTODOS CRUD PARA MENSAJES (usar puerto 3333 - AdonisJS)
  list(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.mensajesApiUrl}/mensajes`); // ← CAMBIAR
  }

  view(id: number): Observable<Mensaje> {
    return this.http.get<Mensaje>(`${this.mensajesApiUrl}/mensajes/${id}`); // ← CAMBIAR
  }

  create(mensaje: Mensaje): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.mensajesApiUrl}/mensajes`, mensaje); // ← CAMBIAR
  }

  update(mensaje: Mensaje): Observable<Mensaje> {
    return this.http.put<Mensaje>(`${this.mensajesApiUrl}/mensajes/${mensaje.id}`, mensaje); // ← CAMBIAR
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.mensajesApiUrl}/mensajes/${id}`); // ← CAMBIAR
  }

  // MÉTODOS ESPECÍFICOS PARA CHAT - CORREGIR TODAS LAS URLs
  getUserConversations(userId: string): Observable<UserConversation[]> {
    console.log('Obteniendo conversaciones para user_id:', userId);

    // ✅ USAR mensajesApiUrl en lugar de environment.url_ms_security
    return this.http.get<any>(`${this.mensajesApiUrl}/mensajes/conversations/${userId}`)
      .pipe(
        map(response => {
          console.log('Respuesta del backend:', response);

          if (response && response.data && Array.isArray(response.data)) {
            // Mapear la estructura del backend a la estructura del frontend
            return response.data.map(conv => ({
              _id: conv.usuario.id,
              id: conv.usuario.id,
              nombre: conv.usuario.name,
              email: conv.usuario.email,
              last_message_content: conv.ultimo_mensaje ? conv.ultimo_mensaje.contenido : 'No hay mensajes',
              last_message_timestamp: conv.ultimo_mensaje ? conv.ultimo_mensaje.created_at : null,
              unread_count: 0 // Por ahora, implementar conteo de no leídos después
            } as UserConversation));
          }

          return [];
        }),
        catchError(error => {
          console.error('Error al obtener conversaciones:', error);
          console.error('Status del error:', error.status);
          console.error('URL usada:', `${this.mensajesApiUrl}/mensajes/conversations/${userId}`);

          // Manejar diferentes tipos de error
          if (error.status === 0) {
            console.warn('Error de CORS o conexión rechazada - ¿Está corriendo AdonisJS en puerto 3333?');
          } else if (error.status === 404) {
            console.warn('Endpoint no encontrado - verificar rutas en AdonisJS');
          } else if (error.status === 500) {
            console.warn('Error del servidor - verificar logs de AdonisJS');
          } else {
            console.warn(`Error ${error.status} - usando datos mock`);
          }

          // SIEMPRE usar datos mock como fallback
          return this.getMockConversations(userId);
        })
      );
  }

  // Obtener mensajes entre dos usuarios - USANDO ENDPOINT REAL
  getMessagesBetweenUsers(user1Id: string, user2Id: string): Observable<Mensaje[]> {
    console.log('Obteniendo mensajes entre:', user1Id, 'y', user2Id);

    // ✅ USAR mensajesApiUrl
    return this.http.get<any>(`${this.mensajesApiUrl}/mensajes/conversation/${user1Id}/${user2Id}`)
      .pipe(
        map(response => {
          console.log('Mensajes del backend:', response);

          if (response && response.data && Array.isArray(response.data)) {
            // Mapear la estructura del backend a la estructura del frontend
            return response.data.map(msg => ({
              id: msg.id,
              contenido: msg.contenido,
              content: msg.contenido,
              fecha: msg.fecha,
              hora: msg.hora,
              timestamp: msg.created_at,
              from_user_id: msg.emisor.id,
              to_user_id: msg.receptor.id,
              user_from: msg.emisor.id,
              user_to: msg.receptor.id,
              is_read: true, // Por ahora, implementar estado de lectura después
              emisor: msg.emisor,
              receptor: msg.receptor,
              es_propio: msg.es_propio
            } as Mensaje));
          }

          return [];
        }),
        catchError(error => {
          console.error('Error al obtener mensajes:', error);
          console.error('URL usada:', `${this.mensajesApiUrl}/mensajes/conversation/${user1Id}/${user2Id}`);

          // Si el endpoint falla, usar datos mock temporalmente
          return this.getMockMessages(user1Id, user2Id);
        })
      );
  }

  // Enviar mensaje - USANDO ENDPOINT REAL
  sendMessage(fromUserId: string, toUserId: string, content: string): Observable<Mensaje> {
    console.log('Enviando mensaje:', { fromUserId, toUserId, content });

    const messageData = {
      contenido: content,
      user_from: fromUserId,
      user_to: toUserId,
      fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      hora: new Date().toTimeString().split(' ')[0] // HH:MM:SS
    };

    // ✅ USAR mensajesApiUrl
    return this.http.post<any>(`${this.mensajesApiUrl}/mensajes`, messageData)
      .pipe(
        map(response => {
          console.log('Mensaje enviado exitosamente:', response);

          if (response && response.data) {
            // Mapear la respuesta del backend
            return {
              id: response.data.id,
              contenido: response.data.contenido,
              content: response.data.contenido,
              fecha: response.data.fecha,
              hora: response.data.hora,
              timestamp: new Date().toISOString(),
              from_user_id: response.data.emisor.id,
              to_user_id: response.data.receptor.id,
              user_from: response.data.emisor.id,
              user_to: response.data.receptor.id,
              is_read: false,
              emisor: response.data.emisor,
              receptor: response.data.receptor
            } as Mensaje;
          }

          throw new Error('Respuesta del servidor inválida');
        }),
        catchError(error => {
          console.error('Error al enviar mensaje:', error);
          throw error;
        })
      );
  }

  // Los usuarios sí siguen usando ms-security (puerto 8081)
  searchUsers(query: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.ms_security}/api/usuarios/search?q=${query}`)
      .pipe(
        catchError(error => {
          console.warn('Endpoint de búsqueda no disponible, usando datos mock');
          return of(this.getMockUsers(query));
        })
      );
  }

  private getMockUsers(query: string): Usuario[] {
    const mockUsers: Usuario[] = [
      { _id: '680f0750ddd1627b2bdd8c1j', nombre: 'Ana Silva', email: 'ana.silva@ejemplo.com' },
      { _id: '680f0750ddd1627b2bdd8c1k', nombre: 'Pedro Martín', email: 'pedro.martin@ejemplo.com' },
      { _id: '680f0750ddd1627b2bdd8c1l', nombre: 'Laura Ruiz', email: 'laura.ruiz@ejemplo.com' }
    ];

    return mockUsers.filter(user =>
      user.nombre?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // MÉTODOS MOCK PARA FALLBACK
  private getMockConversations(userId: string): Observable<UserConversation[]> {
    const mockConversations: UserConversation[] = [
      {
        _id: '680f0750ddd1627b2bdd8c20',
        id: '680f0750ddd1627b2bdd8c20',
        nombre: 'María González',
        email: 'maria.gonzalez@ejemplo.com',
        last_message_content: 'Hola Checho, ¿cómo va todo?',
        last_message_timestamp: new Date(Date.now() - 1800000).toISOString(),
        unread_count: 2
      },
      {
        _id: '680f0750ddd1627b2bdd8c21',
        id: '680f0750ddd1627b2bdd8c21',
        nombre: 'Carlos Ruiz',
        email: 'carlos.ruiz@ejemplo.com',
        last_message_content: 'Perfecto, nos vemos en la reunión',
        last_message_timestamp: new Date(Date.now() - 3600000).toISOString(),
        unread_count: 0
      }
    ];

    return of(mockConversations);
  }

  private getMockMessages(user1Id: string, user2Id: string): Observable<Mensaje[]> {
    const now = Date.now();
    const mockMessages: Mensaje[] = [
      {
        id: 1,
        from_user_id: user2Id,
        to_user_id: user1Id,
        content: 'Hola Checho, ¿cómo estás?',
        contenido: 'Hola Checho, ¿cómo estás?',
        timestamp: new Date(now - 7200000).toISOString(),
        fecha: new Date(now - 7200000).toISOString().split('T')[0],
        user_from: user2Id,
        user_to: user1Id,
        is_read: true
      }
    ];

    return of(mockMessages);
  }
}