const fetch = require('node-fetch');
const unzip = require('unzip');
const request = require('request');
const Rx = require('rxjs/Rx');
// lib
import { ixdzs } from '../ulits/API';
import ERROR from '../ulits/Error';

// interface
import { ISpiderConfig, IBookList, ISearchBook, IDownloadBook } from '../interface/config';
import { IsearchConfig } from '../interface/Spider';
import ABSpider from './Spider';

// export default  class IxSpider extends ABSpider {
export default  class IxSpider {
    // public bookName: string;
    // public indentif: string;
    // public bookNumber: string;
    // public bookList: IBookList[];
    /**
     * 获取书号
     */
    public async searchBook(config: IsearchConfig) {
        // request
        const { bookName } = config;
        const bookList: ISearchBook[] = [];
        if (!bookName) {
            throw new Error('bookname is undefined');
        }
        const html: string = await fetch(ixdzs.searchBookNumber + encodeURI(bookName), {
            method: 'GET',
        }).then((res: any) => {
            if (!res.ok) {
                throw new Error(ERROR.GETBOOKNUMBE);
            }
            return res.text();
        });
        let res;
        const re = /b_name"><a href="(.{1,}?)"[\s\S]{1,}?"_blank">(.{1,}?)<[\s\S]{1,}?p">(.{1,}?)<[\s\S]{1,}?b_intro">([\s\S]{1,}?)</g;
        while ((res = re.exec(html)) !== null) {
            bookList.push({
                bookName: res[2],
                bookNumber: res[1],
                bookState: res[3],
                bookIntro: res[4],
            });
        }
        return bookList;
    }

    /**
     * 获取书目录
     */
    public async getBookList(config: IsearchConfig) {
        const bookNumber = config.bookNumber;
        if (!bookNumber) {
            throw new Error('bookNumber is undefined');
        }
        // /d/169/169208/#epub_down
        const arr = bookNumber.split('/');
        const html: string = await fetch(`${ixdzs.getList}${arr[2]}/${arr[3]}/`, {
            method: 'GET',
        }).then((res: any) => {
            if (!res.ok) {
                throw new Error(ERROR.GETLIST);
            }
            return res.text();
        });
        const re = /<li class="chapter"><a href="([\s\S]{1,}?)"[\s]?title="字数:([\d]{1,}?)">(.{1,}?)(<\/a)/g;
        let res;
        const bookList: IBookList[] = [];
        while ((res = re.exec(html)) !== null) {
            bookList.push({
                href: res[1],
                length: res[2],
                title: res[3],
            });
        }
        return {
            bookList,
            bookNumber,
        };
    }
    /**
     * 获取某章节数据
     * @param str 某一章节对应的地址
     */
    public async getBookData(config: IsearchConfig) {
        if (!config.bookHref) {
            throw new Error('bookHref undefined');
        }
        const bookNumber = config.bookNumber;
        if (!bookNumber) {
            throw new Error('bookNumber is undefined');
        }
        const arr = bookNumber.split('/');
        const ip = '144.123.70.15';
        const port = '9999';
        const html: string = await fetch(`${ixdzs.getList}${arr[2]}/${arr[3]}/${config.bookHref}`, {
            method: 'GET',
            timeout: 10000,
            redirect: 'follow',
            // agent: new HttpProxyAgent('http://' + ip + ':' + port),
        }).then((res: any) => {
            return res.text();
        });
        const re = /<div class="content">([\w\W]*?)<\/div>/g;
        const res = re.exec(html);
        // return {
        //     bookData: res[1],
        //     bookNumber,
        // };
        return Rx.Observable.create((observer: any) => {
            const length = res[1].length;
            const times = Math.floor(length / 600) + 1;
            let i = 0;
            while(i < times) {
                const start = i * 600;
                const end = start + 600 > length ? length : start + 600;
                const data = res[1].slice(start, end);
                console.log(data);
                observer.next(data);
                i++;
                console.log(i);
            }
            // setTimeout(() => {
            //     console.log('complete');
            //     observer.complete();
            // }, 1000)
        })
    }
    /**
     * 下载整本书
     */
    public async getBookAllData(config: IsearchConfig, bookList: Array<IBookList>) {
        const { bookNumber } = config;
        if (!bookNumber) {
            throw new Error('bookNumber is undefined');
        }
        // /d/169/169208/#epub_down
        const url = ixdzs.download + bookNumber.split('/')[3] + '&p=1';
        return Rx.Observable.create(async (observer: any) => {
            const buffer = [];
            let sum = 0;
            request(url)
            .pipe(unzip.Parse())
            .on('entry', function(entry: any) {
                entry.read();
                entry.on('data', (data: any) => {
                    if (!data) {
                        return;
                    }
                    buffer.push(data);
                    sum += data.length;
                    observer.next({
                        type: 'test',
                        data: data,
                    });
                    // const book: Array<IDownloadBook> = [];
                    // const tableIndex = [];
                    // // console.log(iconv.decode(data, 'gbk'));
                    // let str = iconv.decode(data, 'gbk');
                    // if (str.length === 0) {
                    //     return;
                    // }
                    // str = stash + str;
                    // stash = '';
                    // for (let i = lastIndex; i < bookList.length; i++) {
                    //     // let strIndex;
                    //     const offsetIndex: number = i === lastIndex ? 0 : tableIndex[tableIndex.length - 1].offset;
                    //     const offset = str.indexOf(bookList[i].title, offsetIndex);
                    //     if (offset === -1) {
                    //         break;
                    //     }
                    //     tableIndex.push({
                    //         offset,
                    //         title: bookList[i].title,
                    //         webLen: bookList[i].length,
                    //     });
                    // }
                    // for (let i = 0; i < tableIndex.length; i++) {
                    //     if (i === 0) {
                    //         continue;
                    //     }
                    //     const lastOffset = tableIndex[i - 1].offset;
                    //     const nowOffset = tableIndex[i].offset;
                    //     const tableData = str.slice(lastOffset, nowOffset);
                    //     const tableLen = nowOffset - lastOffset;
                    //     const tableOffet = i + lastIndex;
                    //     listState[tableOffet] = 1;
                    //     book.push({
                    //         title: tableIndex[i - 1].title,
                    //         tableLen,
                    //         webLen: tableIndex[i - 1].webLen,
                    //         tableOffet,
                    //         tableData,
                    //     });
                    // }
                    // if (tableIndex.length !== 0) {
                    //     const lastStr = str.slice(tableIndex[tableIndex.length - 1].offset);
                    //     stash += lastStr;
                    //     lastIndex = lastIndex + tableIndex.length - 1;
                    // }
                    // sendLength += book.length;
                    // sendBook.push(book);
                    // if (sendLength > 100) {
                    //     sendLength = 0;
                    //     observer.next({
                    //         type: 'bookData',
                    //         data: Array.prototype.concat.apply([], sendBook),
                    //     });
                    //     Array.prototype.concat.apply([], sendBook).map(item => console.log(item.title));
                    //     sendBook.length = 0;
                    // }
                });
                entry.on('end', () => {
                    console.log('done');
                    // if (sendLength !== 0) {
                    //     sendLength = 0;
                    //     observer.next({
                    //         type: 'bookData',
                    //         data: Array.prototype.concat.apply([], sendBook),
                    //     });
                    //     Array.prototype.concat.apply([], sendBook).map(item => console.log(item.title));
                    //     sendBook.length = 0;
                    // }
                    // observer.next({
                    //     type: 'bookState',
                    //     data: listState,
                    // });
                    const b = Buffer.concat(buffer);
                    console.log(b.length, sum);
                    observer.complete();
                });
            });
        });
    }
}
