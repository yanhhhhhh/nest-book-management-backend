import { Module } from '@nestjs/common';
import { DbService } from './db.service';
export interface DbModuleOptions {
  path: string;
}
// 动态模块
// 不同模块里用传不同的参数，我们会用 register 作为方法名
@Module({})
export class DbModule {
  static register(options: DbModuleOptions) {
    return {
      module: DbModule,
      providers: [
        {
          provide: 'OPTIONS',
          useValue: options,
        },
        DbService,
      ],
      exports: [DbService],
    };
  }
}
