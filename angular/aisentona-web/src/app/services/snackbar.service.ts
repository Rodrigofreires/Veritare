import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) {}

  MostrarErro(
    msg: string,
    verticalPosition: MatSnackBarVerticalPosition = 'top',
    horizontalPosition: MatSnackBarHorizontalPosition = 'right'
  ): void {
    this._snackBar.open(msg, "", {
      duration: 4000,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      panelClass: ['snackbar-error']
    });
  }

  MostrarSucesso(
    msg: string,
    verticalPosition: MatSnackBarVerticalPosition = 'top',
    horizontalPosition: MatSnackBarHorizontalPosition = 'right'
  ): void {
    this._snackBar.open(msg, "", {
      duration: 4000,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      panelClass: ['snackbar-sucesso']
    });
  }
}
