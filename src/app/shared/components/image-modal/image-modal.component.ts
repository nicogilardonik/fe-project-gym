import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-image-modal',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
    <div class="relative bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center max-h-[80vh] min-w-[300px]">
      <button 
        mat-icon-button 
        (click)="close()" 
        class="absolute top-2 right-2 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors w-8 h-8 flex items-center justify-center border-none cursor-pointer"
        aria-label="Cerrar imagen">
        <i class="ph-x font-bold text-lg"></i>
      </button>
      <img 
        [src]="data.imageUrl" 
        [alt]="data.altText || 'Imagen expandida'" 
        class="max-w-full max-h-[80vh] object-contain"
        loading="lazy"
        (error)="onImageError($event)"
      />
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
    .mat-mdc-dialog-container .mdc-dialog__surface {
      background: transparent !important;
      box-shadow: none !important;
    }
  `]
})
export class ImageModalComponent {
    constructor(
        public dialogRef: MatDialogRef<ImageModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string; altText?: string; fallbackUrl?: string }
    ) { }

    close(): void {
        this.dialogRef.close();
    }

    onImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        if (this.data.fallbackUrl && target.src !== this.data.fallbackUrl) {
            target.src = this.data.fallbackUrl;
        }
    }
}
