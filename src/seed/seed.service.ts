import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Expose, Type, plainToInstance } from 'class-transformer';
import { IsArray, IsString, ValidateNested, validate } from 'class-validator';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';

class POKEAPI_PokemonResultDTO {
  @Expose()
  @IsString()
  name: string;
  @Expose()
  @IsString()
  url: string;

  getNO() {
    const url = this.url.split('/');
    return +url[url.indexOf('pokemon') + 1];
  }

  mapToPokemon(): Pokemon {
    return { name: this.name, no: this.getNO() } as Pokemon;
  }
}

class POKEAPI_PokemonResponseDTO {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => POKEAPI_PokemonResultDTO)
  results: POKEAPI_PokemonResultDTO[];
}

@Injectable()
export class SeedService {
  constructor(private pokemonService: PokemonService) {}

  async populate() {
    const pokemonsResponse: POKEAPI_PokemonResponseDTO = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0',
    ).then((x) => x.json());

    const pResponse = plainToInstance(
      POKEAPI_PokemonResponseDTO,
      pokemonsResponse,
      {
        excludeExtraneousValues: true,
      },
    );
    // console.log(pResponse instanceof PokemonResponseDTO);
    // console.log(pResponse.results[0] instanceof PokemonResultDTO);

    const validationErrors = await validate(pResponse, {
      stopAtFirstError: true,
    });

    if (validationErrors.length > 0) {
      throw new InternalServerErrorException(
        'Error en la validacion de PokemonResponseDTO=\n' +
          validationErrors[0].toString(),
      );
    }

    await this.pokemonService.bulkInsert(
      pResponse.results.map((x) => x.mapToPokemon()),
    );

    return 'se han cargado pokemons a la DB';
  }
}
