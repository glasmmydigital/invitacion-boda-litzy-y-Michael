import { Component } from '@angular/core';
import { TraductorServicio } from '../../Services/traductor.service';

@Component({
  selector: 'app-portada',
  standalone: true,
  imports: [],
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.scss']
})
export class PortadaComponent {
  private cuentaRegresiva: any;

  constructor(public traductorService: TraductorServicio) {}

  ngOnInit() {
    const fechaObjetivo = new Date('2025-05-31T16:00:00'); // Cambia esto por la fecha de tu evento

    const actualizarContador = () => {
        if (typeof document !== 'undefined') { // Verificación de entorno
            const ahora = new Date().getTime();
            const distancia = fechaObjetivo.getTime() - ahora;

            let dias = 0, horas = 0, minutos = 0, segundos = 0;

            if (distancia > 0) {
                dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
                horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
                segundos = Math.floor((distancia % (1000 * 60)) / 1000);

                // Actualizar el contador cada segundo mientras haya tiempo restante
                setTimeout(actualizarContador, 1000);
            }

            // Actualizar el DOM
            document.getElementById('dias')!.innerText = dias.toString();
            document.getElementById('horas')!.innerText = horas.toString();
            document.getElementById('minutos')!.innerText = minutos.toString();
            document.getElementById('segundos')!.innerText = segundos.toString();
        }
    };

    actualizarContador();
    this.traductorService.lenguaje = "ES";
  }




  cambiarIdioma(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.traductorService.lenguaje = isChecked ? 'EN' : 'ES';
  }

}
