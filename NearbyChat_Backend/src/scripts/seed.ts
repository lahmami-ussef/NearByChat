import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ZoneService } from '../zone/zone.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from '../zone/zone.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // On récupère le repository TypeORM directement
  const zoneRepository = app.get<Repository<Zone>>('ZoneRepository');

  // Définition des zones avec des polygones rectangulaires approximatifs autour de Rabat/Salé
  // Format PostGIS (GeoJSON / ST_GeomFromGeoJSON): Les coordonnées sont en [Longitude, Latitude]
  // Note: Un polygone doit être fermé, donc le premier et le dernier point doivent être identiques
  const zonesToSeed = [
    {
      name: 'Quartier Hassan',
      color: '#FF6B6B',
      polygon: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-6.83, 34.01],
            [-6.81, 34.01],
            [-6.81, 34.025],
            [-6.83, 34.025],
            [-6.83, 34.01]
          ]
        ]
      }
    },
    {
      name: 'Agdal',
      color: '#4ECDC4',
      polygon: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-6.855, 33.995],
            [-6.840, 33.995],
            [-6.840, 34.010],
            [-6.855, 34.010],
            [-6.855, 33.995]
          ]
        ]
      }
    },
    {
      name: 'Université Mohammed V',
      color: '#FFE66D',
      polygon: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-6.860, 33.985],
            [-6.845, 33.985],
            [-6.845, 33.995],
            [-6.860, 33.995],
            [-6.860, 33.985]
          ]
        ]
      }
    },
    {
      name: 'Salé Médina',
      color: '#A8E6CF',
      polygon: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-6.825, 34.030],
            [-6.810, 34.030],
            [-6.810, 34.045],
            [-6.825, 34.045],
            [-6.825, 34.030]
          ]
        ]
      }
    }
  ];

  console.log('Seeding zones...');
  for (const zoneData of zonesToSeed) {
    const exists = await zoneRepository.findOne({ where: { name: zoneData.name } });
    if (!exists) {
      const newZone = zoneRepository.create(zoneData);
      await zoneRepository.save(newZone);
      console.log(`Zone created: ${zoneData.name}`);
    } else {
      console.log(`Zone already exists: ${zoneData.name}`);
    }
  }

  console.log('Seed done!');
  await app.close();
}

bootstrap();
