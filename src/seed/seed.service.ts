import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { HttAdapter } from 'src/common/interfaces/http-adapter.interface';
import { IPokeResponse } from 'src/common/interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {

  }

  async executeSeed() {
    await this.pokemonModel.deleteMany();
    const data = await this.http.get<IPokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=555');
    const pokemons = data.results.map((p => {
      const { url } = p;
      const segments = url.split('/');
      return {
        name: p.name,
        no: +segments[segments.length - 2]
      }
    }))
    await this.pokemonModel.insertMany(pokemons);
    return 'Seed Executed!';
  }

}
