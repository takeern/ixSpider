interface IConfig {
    bookName?: string;
    changeTimes?: number;
}

interface ISpiderConfig {
    bookName: string;
}

interface IBookList {
    title: string;
    length: string;
    href: string;
}

interface IBookListRes {
    bookList: IBookList[];
    bookNumber: string;
}

interface IBookData {
    bookNumber: string;
    bookData: string;
}
// interface SpiderConfig
interface ISearchBook {
    bookNumber: string;
    bookName: string;
    bookIntro: string;
    bookState: string;
}
export {
    ISpiderConfig,
    IBookListRes,
    IConfig,
    IBookData,
    IBookList,
    ISearchBook,
};
