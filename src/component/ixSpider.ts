require('isomorphic-fetch');
const unzip = require('unzip');
const request = require('request');

// lib
import { ixdzs } from '../ulits/API';
import ERROR from '../ulits/Error';

// interface
import { ISpiderConfig, IBookList } from '../interface/config';
import { ISpider } from '../interface/Spider';
import ABSpider from './Spider';

export default  class IxSpider extends ABSpider implements ISpider {
    public bookName: string;
    public indentif: string;
    public bookNumber: string;
    public bookList: IBookList[];
    constructor(config: ISpiderConfig) {
        super();
        this.bookName = config.bookName;
        this.indentif = ixdzs.indentif;
    }
    /**
     * 获取书号
     */
    public async searchBook() {
        // request
        const html: string = await fetch(ixdzs.searchBookNumber + encodeURI(this.bookName), {
            method: 'GET',
        }).then((res) => {
            if (!res.ok) {
                throw new Error(ERROR.GETBOOKNUMBE);
            }
            return res.text();
        });
        const inLength = this.indentif.length;
        const beginIndex = html.indexOf(this.indentif);
        if (!beginIndex) {
            throw new Error(ERROR.PRASEHTML);
        }
        const ns = html.slice(beginIndex + inLength);
        const endIndex = ns.indexOf(' ');
        this.bookNumber = ns.slice(0, endIndex - 1);
        return this.bookNumber;
    }

    /**
     * 获取书目录
     */
    public async getBookList() {
        let bookNumber = this.bookNumber;
        if (!bookNumber) {
            bookNumber = await this.searchBook();
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
        const reslut = [];
        while ((res = re.exec(html)) !== null) {
            reslut.push({
                href: res[1],
                length: res[2],
                title: res[3],
            });
        }
        this.bookList = reslut;
        return reslut;
    }
    /**
     * 获取某章节数据
     * @param str 某一章节对应的地址
     */
    public async getBookData(str: string) {
        let bookNumber = this.bookNumber;
        if (!bookNumber) {
            bookNumber = await this.searchBook();
        }
        const arr = bookNumber.split('/');
        const html: string = await fetch(`${ixdzs.getList}${arr[2]}/${arr[3]}/${str}`, {
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
    public async getBookAllData() {
        let bookNumber = this.bookNumber;
        if (!bookNumber) {
            bookNumber = await this.searchBook();
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
