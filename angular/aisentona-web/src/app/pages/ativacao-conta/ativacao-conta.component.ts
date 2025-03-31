import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AtivacaoService } from '../../services/ativacao.service';

@Component({
  selector: 'app-ativacao-conta',
  templateUrl: './ativacao-conta.component.html',
  styleUrls: ['./ativacao-conta.component.css']
})
export class AtivacaoContaComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private ativacaoService: AtivacaoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    
    if (token) {
      this.ativacaoService.ativarConta(token).subscribe({
        next: () => {
          this.snackBar.open('Conta ativada com sucesso!', 'OK', { duration: 3000 });
          this.router.navigate(['/ativacao-sucesso']); // 🔹 Redireciona para a página de sucesso
        },
        error: () => {
          this.snackBar.open('Token inválido ou expirado.', 'OK', { duration: 3000 });
          this.router.navigate(['/ativacao-erro']); // 🔹 Redireciona para a página de erro
        }
      });
    } else {
      this.snackBar.open('Token não encontrado.', 'OK', { duration: 3000 });
      this.router.navigate(['/']); // 🔹 Redireciona para home se o token não existir
    }
  }
}
