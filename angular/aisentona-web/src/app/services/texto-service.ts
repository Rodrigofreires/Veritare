import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })

export class TextoService{
    
    ajustarAlturaTextarea(textarea: HTMLTextAreaElement): void {
        textarea.style.height = 'auto'; // Redefine a altura para calcular corretamente o scrollHeight
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta a altura com base no conteúdo
    }

}