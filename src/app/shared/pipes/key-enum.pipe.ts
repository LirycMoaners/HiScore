import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe made to retrieve key value couple for each value in an enum
 *
 * @export
 */
@Pipe({ name: 'keyEnum' })
export class KeyEnumPipe implements PipeTransform {
  transform(enumValue: any): { key: string, value: string }[] {
    const keyEnum: { key: string, value: string }[] = [];
    Object.keys(enumValue).forEach((key: string) => keyEnum.push({ key, value: enumValue[key] }));
    return keyEnum;
  }
}
