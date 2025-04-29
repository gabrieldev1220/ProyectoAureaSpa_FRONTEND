import { Component, OnInit } from '@angular/core';
import { ReservaService } from '@core/services/reserva.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Reserva {
  id: number;
  cliente: { nombre: string; apellido: string; email: string };
  empleado: { nombre: string; apellido: string };
  fechaReserva: string;
  servicio: string;
  status: string;
}

@Component({
  selector: 'app-recepcionista-dashboard',
  standalone: false,
  templateUrl: './recepcionista-dashboard.component.html',
  styleUrls: ['./recepcionista-dashboard.component.scss']
})
export class RecepcionistaDashboardComponent implements OnInit {
  reservas: Reserva[] = [];
  private apiUrl = 'http://localhost:8080/api/admin/reservas';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.getReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
      },
      error: (error) => {
        console.error('Error al cargar las reservas:', error);
        alert('Error al cargar las reservas. Por favor, intenta de nuevo.');
      }
    });
  }

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }
}
