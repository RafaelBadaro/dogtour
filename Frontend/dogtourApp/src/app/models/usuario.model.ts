import { Cachorro } from 'src/app/models/cachorro.model';
import { Horario } from './horario.model';
import { Tour } from './tour.model';
export class Usuario {

    idUser: string;

    email: string;

    name: string;

    role: string;

    rating: string;

    dogs?: Cachorro[];

    horarios?: Horario[];

    tourCompletado: Tour;
}
