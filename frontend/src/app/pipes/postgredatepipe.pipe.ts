import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postgredatepipe'
})
export class PostgredatepipePipe implements PipeTransform {

  transform(value: any){
    if (!value) return '';

    const date = new Date(value);

    // Ajusta para o fuso horário de Brasília (UTC-3)
    date.setHours(date.getHours());

    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    const hora = String(date.getHours()).padStart(2, '0');
    const minuto = String(date.getMinutes()).padStart(2, '0');
    const segundo = String(date.getSeconds()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
  }

}
