const fetch = require("node-fetch");
const unzip = require('unzip');
const request = require('request');
const HttpProxyAgent = require('http-proxy-agent');

// lib
import { ixdzs } from '../ulits/API';
import ERROR from '../ulits/Error';

// interface
import { ISpiderConfig, IBookList, ISearchBook } from '../interface/config';
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
        const bookList: ISearchBook[] = [];
        if (!bookName) {
            throw new Error('bookname is undefined');
        }
        const html: string = await fetch(ixdzs.searchBookNumber + encodeURI(bookName), {
            method: 'GET',
        }).then((res) => {
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
        }).then((res) => {
            return res.text();
        });
        const re = /<div class="content">([\w\W]*?)<\/div>/g;
        const res = re.exec(html);
        return {
            bookData: res[1],
            bookNumber,
        };
    }
    /**
     * 下载整本书
     */
    public async getBookAllData(config: IsearchConfig) {
        const bookNumber = config.bookNumber;
        if (!bookNumber) {
            throw new Error('bookNumber is undefined');
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
