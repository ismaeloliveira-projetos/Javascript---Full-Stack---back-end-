import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class ShortenUrlDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'A URL não pode estar vazia.' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsUrl({}, { message: 'URL inválida. Informe uma URL válida (http/https).' })
  url: string;
}
