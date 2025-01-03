import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SnackbarService } from "./snackbar.service";
import { Observable, catchError, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

export class ImagemService{

    private readonly arquivosPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
    private readonly tamanhoMaximoMB = 5;
    private readonly tamanhoMaximoBytes = this.tamanhoMaximoMB * 1024 * 1024;
   
  
constructor(
    private http: HttpClient,
    private _snackBarService : SnackbarService) {}

    validarArquivo(file: File): boolean {
        // Verifica se o tipo de arquivo é permitido
        if (!this.arquivosPermitidos.includes(file.type)) {
          this._snackBarService.MostrarErro('Formato de arquivo não suportado. Por favor, selecione uma imagem JPEG, PNG ou GIF.');
          return false;
        }
      
        // Verifica se o tamanho do arquivo excede o limite
        if (file.size > this.tamanhoMaximoBytes) {
          this._snackBarService.MostrarErro(`O tamanho do arquivo excede o limite de ${this.tamanhoMaximoMB} MB. Por favor, selecione uma imagem menor.`);
          return false;
        }
      
        // Se o arquivo for válido
        this._snackBarService.MostrarSucesso('Arquivo válido para upload.');
        return true;
    }

    uploadImagem(file: File, uploadUrl: string): Observable<any> {
        const formData = new FormData();
        formData.append('image', file, file.name);
    
        return this.http.post(uploadUrl, formData).pipe(
          catchError(error => {
            console.error('Erro no upload da imagem:', error);
            return throwError('Falha no upload da imagem. Por favor, tente novamente mais tarde.');
          })
        );
      }   

}