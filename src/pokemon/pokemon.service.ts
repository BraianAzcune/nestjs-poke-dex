import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoError } from 'mongodb';
import mongoose, { Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/Pagination';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      return await this.pokemonModel.create(createPokemonDto);
    } catch (error) {
      console.log('error al crear', createPokemonDto, error);
      this.handleExceptions(error);
    }
  }

  async bulkInsert(pokemons: Pokemon[]) {
    pokemons.forEach((x) => (x.name = x.name.toLowerCase()));
    try {
      return await this.pokemonModel.insertMany(pokemons);
    } catch (error) {
      console.error('error al hacer insercion masiva de pokemons', error);
      this.handleExceptions(error);
    }
  }

  findAll(q: PaginationDto) {
    return this.pokemonModel
      .find()
      .sort({ _id: 1 })
      .skip(q.offset)
      .limit(q.limit);
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

  async update(termino: string, updatePokemonDto: UpdatePokemonDto) {
    const p = await this.findOne(termino);
    if (updatePokemonDto.name != undefined) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      await p.updateOne(updatePokemonDto);
    } catch (error) {
      this.handleExceptions(error);
    }

    return { ...p.toJSON(), ...updatePokemonDto } as Pokemon;
  }

  async remove(mongoID: string) {
    // const p = await this.findOne(mongoID);
    // return await p.deleteOne();
    const rta = await this.pokemonModel.deleteOne({ _id: mongoID });
    if (rta.deletedCount == 0) {
      throw new NotFoundException(`pokemon con id <${mongoID}> no encontrado`);
    }
    return 'borrador exitoso';
  }

  private handleExceptions(error: any) {
    if (!(error instanceof MongoError)) {
      throw new InternalServerErrorException(
        'no se puede <crear|editar> el pokemon\n' + typeof error,
      );
    }
    if (error.code === 11000) {
      throw new BadRequestException(
        `No puede cambiar el <name> o <no> a esos valores, ya que estan ocupados ${JSON.stringify(
          (error as any)?.keyValue,
        )}`,
      );
    } else {
      throw new InternalServerErrorException(
        'No se puede <crear|editar> el pokemon\n' +
          typeof error +
          '\nerror.code=' +
          error.code,
      );
    }
  }
}
