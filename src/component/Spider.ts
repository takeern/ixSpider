import { IsearchConfig } from '../interface/Spider';
import { IBookList } from '../interface/config';

abstract class ABSpider {
    public abstract searchBook(config: IsearchConfig): Promise<string>;
    public abstract getBookList(config: IsearchConfig): Promise<IBookList[]>;
    public abstract getBookData(config: IsearchConfig): Promise<string>;
    public abstract getBookAllData(config: IsearchConfig): Promise<{}>;
}

export default ABSpider;
