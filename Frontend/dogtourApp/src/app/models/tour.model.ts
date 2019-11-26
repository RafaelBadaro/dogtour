export class Tour{

    tour_id: string;
    owner_id: string;
    dog_id: string;
    walker_id: string;
    day: string;
    time: string;
    latitude: string;
    longitude: string;
    status: string;


    ownerName: string;

    walkerName: string;

    dogName: string;

}

export enum StatusTour{
    Aguardando_Confirmacao = '0',
    Confirmado = '1',
    Em_Andamento = '2',
    Cancelado = '3',
}

