import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { IPokeResponse } from 'src/interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<IPokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=555');
    const pokemons = data.results.map((p => {
      const { url } = p;
      const segments = url.split('/');
      return {
        name: p.name,
        no: +segments[segments.length - 2]
      }
    }))
    return pokemons;
  }

}
