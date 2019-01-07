import { IsearchConfig } from '../interface/Spider';
import { IBookListRes, IBookData, ISearchBook } from '../interface/config';

abstract class ABSpider {
    public abstract searchBook(config: IsearchConfig): Promise<ISearchBook[]>;
    public abstract getBookList(config: IsearchConfig): Promise<IBookListRes>;
    public abstract getBookData(config: IsearchConfig): Promise<IBookData>;
    public abstract getBookAllData(config: IsearchConfig): Promise<{}>;
}

export default ABSpider;
