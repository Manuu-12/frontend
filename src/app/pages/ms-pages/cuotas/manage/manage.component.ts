import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cuotas } from 'src/app/models/cuotas.model';
import { CuotasService } from 'src/app/services/cuotasService/cuotas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1->View, 2->Create, 3->Update
  cuota: Cuotas;

  constructor(private activateRoute: ActivatedRoute,
    private cuotasService: CuotasService,
    private router: Router) {
    this.cuota = { id: 0 };
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activateRoute.snapshot.params.id) {
      this.cuota.id = this.activateRoute.snapshot.params.id;
      this.getCuota(this.cuota.id);
    }
  }

  getCuota(id: number) {
    this.cuotasService.view(id).subscribe({
      next: (cuota) => {
        this.cuota = cuota;
        console.log('Cuota fetched successfully:', this.cuota);
      },
      error: (error) => {
        console.error('Error fetching cuota:', error);
      }
    });
  }

  back() {
    this.router.navigate(['/cuotas/list']);
  }

  create() {
    this.cuotasService.create(this.cuota).subscribe({
      next: (cuota) => {
        console.log('Cuota created successfully:', cuota);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/cuotas/list']);
        });
      },
      error: (error) => {
        console.error('Error creating cuota:', error);
      }
    });
  }

  update() {
    this.cuotasService.update(this.cuota).subscribe({
      next: (cuota) => {
        console.log('Cuota updated successfully:', cuota);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/cuotas/list']);
      },
      error: (error) => {
        console.error('Error updating cuota:', error);
      }
    });
  }

  delete(id: number) {
    console.log('Delete cuota with id:', id);
    Swal.fire({
      title: 'Eliminar',
      text: 'Está seguro que quiere eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuotasService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
            this.ngOnInit();
          },
          error: (error) => {
            console.error('Error deleting cuota:', error);
          }
        });
      }
    });
  }
}
