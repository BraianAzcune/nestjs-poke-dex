<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# construir aplicacion
1. clonar el repositorio
2. ejecutar para descargar dependencias
```cmd
npm install
```
3. levantar base de datos con
```cmd
docker-compose up -d 
```

4. crear copia de __.env.template__ y renombrar a __.env__
configurar las variables


5. ejecutar aplicacion en modo de deteccion de cambios
```cmd
npm run start:dev
```

# construir las imagenes docker
construir
```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
ejecutar
```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up
```

#### Nota
Por defecto, **docker-compose** usa el archivo .env, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con
```bash
docker-compose -f docker-compose.prod.yaml up --build
```


