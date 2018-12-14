abstract class ABSpider {
    public abstract searchBook(): void;
    public abstract getBookList(): void;
    public abstract getBookData(str: string): void;
    public abstract getBookAllData(): void;
}

export default ABSpider;
