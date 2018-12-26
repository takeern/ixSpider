require('isomorphic-fetch');
const unzip = require('unzip');
const request = require('request');

// lib
import { ixdzs } from '../ulits/API';
import ERROR from '../ulits/Error';

// interface
import { ISpiderConfig, IBookList } from '../interface/config';
import { IsearchConfig } from '../interface/Spider';
import ABSpider from './Spider';

export default  class IxSpider extends ABSpider {
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
        if (!bookName) {
            throw new Error('bookname is undefined');
        }
        const { indentif } = ixdzs;
        const html: string = await fetch(ixdzs.searchBookNumber + encodeURI(bookName), {
            method: 'GET',
        }).then((res) => {
            if (!res.ok) {
                throw new Error(ERROR.GETBOOKNUMBE);
            }
            return res.text();
        });
        const inLength = indentif.length;
        const beginIndex = html.indexOf(indentif);
        if (beginIndex === -1) {
            throw new Error(ERROR.PRASEHTML);
        }
        const ns = html.slice(beginIndex + inLength);
        const endIndex = ns.indexOf(' ');
        const bookNumber = ns.slice(0, endIndex - 1);
        return bookNumber;
    }

    /**
     * 获取书目录
     */
    public async getBookList(config: IsearchConfig) {
        let bookNumber = config.bookNumber;
        if (!bookNumber) {
            bookNumber = await this.searchBook(config);
        }
        // /d/169/169208/#epub_down
        const arr = bookNumber.split('/');
        const html: string = await fetch(`${ixdzs.getList}${arr[2]}/${arr[3]}/`, {
            method: 'GET',
        }).then((res) => {
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
        return bookList;
    }
    /**
     * 获取某章节数据
     * @param str 某一章节对应的地址
     */
    public async getBookData(config: IsearchConfig) {
        let bookNumber = config.bookNumber;
        if (!config.bookHref) {
            throw new Error('bookHref undefined');
        }
        if (!bookNumber) {
            bookNumber = await this.searchBook(config);
        }
        const arr = bookNumber.split('/');
        const html: string = await fetch(`${ixdzs.getList}${arr[2]}/${arr[3]}/${config.bookHref}`, {
            method: 'GET',
        }).then((res) => {
            return res.text();
        });
        const re = /<div class="content">([\w\W]*?)<\/div>/g;
        const res = re.exec(html);
        return res[1];
    }
    /**
     * 下载整本书
     */
    public async getBookAllData(config: IsearchConfig) {
        let bookNumber = config.bookNumber;
        if (!bookNumber) {
            bookNumber = await this.searchBook(config);
        }
        const arr = bookNumber.split('/');
        const url = `${ixdzs.download}/down/${arr[3]}_1`;
        return new Promise((resolve) => {
            try {
                request(url).pipe(unzip.Parse())
                    .on('entry', function(entry: any) {
                        resolve(entry);
                    });
            } catch (e) {
                throw new Error(ERROR.GETBOOKALLDATA);
            }
        });
    }
}
