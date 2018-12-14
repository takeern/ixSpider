interface IConfig {
    bookName: string;
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

// interface SpiderConfig

export {
    ISpiderConfig,
    IBookList,
    IConfig
};
