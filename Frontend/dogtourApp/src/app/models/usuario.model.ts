import { Cachorro } from 'src/app/models/cachorro.model';
export class Usuario {

    idUser: string;

    email: string;

    name: string;

    role: string;

    dogs?: Cachorro[];

    horarios?: string[];
}
