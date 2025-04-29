import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DbService } from 'src/db/db.service';
import { Book } from './entities/book.entity';
function randomId() {
  return Math.floor(Math.random() * 1000000);
}
@Injectable()
export class BookService {
  @Inject(DbService)
  private db: DbService;

  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.db.read();
    const newBook = new Book();
    newBook.id = randomId();
    newBook.name = createBookDto.name;
    newBook.author = createBookDto.author;
    newBook.description = createBookDto.description;
    newBook.cover = createBookDto.cover;

    books.push(newBook);
    await this.db.write(books);

    return newBook;
  }

  async findAll() {
    return await this.db.read();
  }

  async findOne(id: number) {
    const books: Book[] = await this.db.read();
    const book = books.find((book) => book.id === id);
    if (!book) {
      throw new BadRequestException('Book not found');
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.db.read();
    // Array.prototype.find 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
    //  Array.prototype.find 返回对象 的引用，而不是对象的副本。修改返回的对象将修改原始数组。
    //  如果你想要一个副本，你可以使用 Array.prototype.findIndex 方法，然后使用 Array.prototype.slice 方法。

    const foundBook = books.find((book) => book.id === id); // 查找图书

    if (!foundBook) {
      throw new BadRequestException('Book not found');
    }
    // 更新图书
    // foundBook = {...} 这种写法，其实是 给变量 foundBook 赋了一个新对象 ，而不是修改原数组中的对象。

    // foundBook = {
    //   ...foundBook,
    //   ...updateBookDto,
    // };

    // 使用Object.assign()方法 可以实现浅拷贝
    // 或者使用index 来修改原数组中的对象
    // books[books.findIndex((book) => book.id === id)] = {
    //   ...foundBook,
    //  ...updateBookDto,
    // };
    Object.assign(foundBook, updateBookDto);
    // 保存图书
    this.db.write(books);
    return foundBook;
  }

  async remove(id: number) {
    const books: Book[] = await this.db.read();
    const newBooks = books.filter((book) => book.id !== id);
    this.db.write(newBooks);
    return newBooks;
  }
}
