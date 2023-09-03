import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import mongoose, { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { MongoError } from 'mongodb';
import { NotFoundError } from 'rxjs';

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

  async findOne(termino: string): Promise<Pokemon> {
    let p = undefined;
    if (!isNaN(+termino)) {
      p = await this.pokemonModel.findOne({ no: termino });
    } else if (mongoose.isValidObjectId(termino)) {
      p = await this.pokemonModel.findById(termino);
    } else if (/^[a-zA-Z]$/.test(termino)) {
      p = await this.pokemonModel.findOne({ name: termino });
    } else {
      throw new BadRequestException(
        'el termino enviado no es ni un <no> o un <id mongo> ni un <nombre>',
      );
    }
    if (p == undefined) {
      throw new NotFoundException('pokemon no encontrado');
    }
    return p;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
