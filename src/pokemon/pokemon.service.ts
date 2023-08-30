import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { MongoError } from 'mongodb';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      return await this.pokemonModel.create(createPokemonDto);
    } catch (error) {
      console.log('error al crear', createPokemonDto, error);
      if (!(error instanceof MongoError)) {
        throw new InternalServerErrorException(
          'no se puede crear el pokemon\n' + typeof error,
        );
      }
      if (error.code === 11000) {
        throw new BadRequestException(
          `El pokemon existe en la base de datos ${JSON.stringify(
            (error as any)?.keyValue,
          )}`,
        );
      } else {
        throw new InternalServerErrorException(
          'no se puede crear el pokemon\n' +
            typeof error +
            '\nerror.code=' +
            error.code,
        );
      }
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
