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

export {
    ISpiderConfig,
    IBookListRes,
    IConfig,
    IBookData,
    IBookList,
};
