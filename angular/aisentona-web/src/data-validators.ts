import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Isso faz com que o serviço seja acessível em toda a aplicação
})
export class DataValidators {
  /**
   * Formata um CPF no padrão 000.000.000-00.
   */
  static formatarCPF(cpf: string): string {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length > 3 && cpf.length <= 6) {
      return cpf.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (cpf.length > 6 && cpf.length <= 9) {
      return cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (cpf.length > 9) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    }

    return cpf;
  }

  /**
   * Valida o CPF verificando os dígitos.
   */
  static validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11) return false;

    const validarDigito = (cpf: string, pesoInicial: number): number => {
      let soma = 0;
      for (let i = 0; i < pesoInicial - 1; i++) {
        soma += parseInt(cpf[i]) * (pesoInicial - i);
      }
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const primeiroDigito = validarDigito(cpf, 10);
    const segundoDigito = validarDigito(cpf, 11);

    return (
      parseInt(cpf[9]) === primeiroDigito && parseInt(cpf[10]) === segundoDigito
    );
  }

  /**
   * Formata um número de celular no padrão (XX) XXXXX-XXXX.
   */
  static formatarCelular(telefone: string): string {
    telefone = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (telefone.length > 2 && telefone.length <= 7) {
      return telefone.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    } else if (telefone.length > 7) {
      return telefone.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    }

    return telefone;
  }

  // Método para formatar a data no padrão 'dd/MM/yyyy'
  static formatarData(data: string): string {
    // Remove qualquer caractere que não seja número
    const numeros = data.replace(/\D/g, '');

    // Verifica se a quantidade de números é suficiente para formar uma data válida
    if (numeros.length >= 8) {
      // Formata a data para 'dd/MM/yyyy'
      const dia = numeros.slice(0, 2);
      const mes = numeros.slice(2, 4);
      const ano = numeros.slice(4, 8);

      return `${dia}/${mes}/${ano}`;
    }

    return data; // Retorna a data original caso não tenha 8 dígitos
  }

  /**
   * Permite digitar apenas números em eventos de teclado.
   */
  static permitirSomenteNumeros(event: KeyboardEvent): void {
    const charCode = event.charCode || event.keyCode || event.which;
    const char = String.fromCharCode(charCode);

    // Permite apenas números
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }
  }
}
