import { Inject, Injectable } from '@nestjs/common';
import { access, readFile, writeFile } from 'fs/promises';
import { DbModuleOptions } from './db.module';

@Injectable()
export class DbService {
  @Inject('OPTIONS')
  private options: DbModuleOptions;

  /**
   *
   * @returns
   * 读取文件内容,并返回数组
   */
  async read() {
    const filePath = this.options.path;
    try {
      await access(filePath); //测试用户对 path 指定的文件或目录的权限,如果用户没有指定的权限,则抛出异常,否则返回 undefined
      console.log('can access');
    } catch (e) {
      console.log('cannot access');
      return [];
    }
    const fileContent = await readFile(filePath, {
      encoding: 'utf-8',
    });
    if (!fileContent) {
      return [];
    }
    return JSON.parse(fileContent);
  }
  async write(obj: Record<string, any>) {
    const filePath = this.options.path;
    await writeFile(filePath, JSON.stringify(obj || {}), {
      encoding: 'utf-8',
    });
  }
}
