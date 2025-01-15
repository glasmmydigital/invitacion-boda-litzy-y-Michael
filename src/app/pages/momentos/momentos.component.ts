import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TraductorServicio } from '../../Services/traductor.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-momentos',
  standalone: true,
  imports: [],
  templateUrl: './momentos.component.html',
  styleUrls: ['./momentos.component.scss']
})
export class MomentosComponent implements AfterViewInit, OnDestroy {

  slideIndex: number = 0;  // Índice del slide
  totalSlides: number = 0; // Total de slides
  currentIndex: number = 0; // Índice de la imagen activa
  slideInterval: any; // Intervalo para cambiar de slide automáticamente

  // Referencias a los botones de navegación
  @ViewChild('prevButton') prevButton: ElementRef | undefined;
  @ViewChild('nextButton') nextButton: ElementRef | undefined;
  @ViewChild('slides') slidesContainer: ElementRef | undefined;

  constructor(
    public traductorService: TraductorServicio,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Espera a que el contenido esté renderizado
      setTimeout(() => {
        // Total de slides
        this.totalSlides = this.slidesContainer?.nativeElement.children.length || 0;
        this.showSlide(this.currentIndex); // Muestra la primera imagen
        // Cambiar la imagen automáticamente
        this.slideInterval = setInterval(() => {
          this.moveSlide(1);  // Mueve el carrusel cada 3 segundos
        }, 3000); // Intervalo de 3 segundos
      });
    }

    // Event listeners para los botones de navegación
    this.prevButton?.nativeElement.addEventListener('click', () => {
      this.prevSlide();
    });

    this.nextButton?.nativeElement.addEventListener('click', () => {
      this.nextSlide();
    });
  }

  // Mostrar la imagen actual
  showSlide(index: number): void {
    const slides = this.slidesContainer?.nativeElement.children;
    if (slides) {
      for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active'); // Elimina la clase 'active'
      }
      // Solo la imagen activa se muestra
      if (slides[index]) {
        slides[index].classList.add('active');
      }
    }
  }

  // Cambiar a la siguiente imagen
  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.showSlide(this.currentIndex);
  }

  // Cambiar a la imagen anterior
  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.showSlide(this.currentIndex);
  }

  // Cambiar de imagen automáticamente después de un intervalo
  moveSlide(direction: number): void {
    if (direction === 1) {
      this.nextSlide();
    } else if (direction === -1) {
      this.prevSlide();
    }
  }

  // Limpiar el intervalo al destruir el componente
  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}
