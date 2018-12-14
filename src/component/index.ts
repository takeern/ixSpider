import IxSpider from './ixSpider';

// lib
import { SPIDERTYPES } from '../ulits/STATS';
import ERROR from '../ulits/Error';

// interface
import { IConfig } from '../interface/config';

export default class Spider {
    public type: string;
    public bookName: string;
    public spider: any;
    public count: number;
    public changeTimes: number;
    constructor(config: IConfig) {
        this.bookName = config.bookName;
        this.changeTimes = config.changeTimes || 5;
        this.type = SPIDERTYPES[0];
        this.count = 0;
        this.changeOrigin();
    }

    public async run(command: string, str?: string) {
        let result: any;
        try {
            switch (command) {
                case('searchBook'): {
                    result = await this.spider.searchBook();
                    return {
                        data: result,
                        type: this.type,
                    };
                }
                case('getBookList'): {
                    result = await this.spider.getBookList();
                    return {
                        data: result,
                        type: this.type,
                    };
                }
                case('getBookData'): {
                    result = await this.spider.getBookData(str);
                    return {
                        data: result,
                        type: this.type,
                    };
                }
                case('getBookAllData'): {
                    result = await this.spider.getBookAllData();
                    return {
                        data: result,
                        type: this.type,
                    };
                }
                default: return new Error(ERROR.COMMANDERROR);
            }
        } catch (e) {
            if (e.message === ERROR.COMMANDERROR) {
                throw e;
            } else {
                this.count += 1;
                if (this.count > this.changeTimes) {
                    return new Error(ERROR.ORGINERROR);
                }
                this.turnType();
                this.run(command, str);
            }
        }
    }

    public turnType() {
        const {length} = SPIDERTYPES;
        if (this.type === SPIDERTYPES[length]) {
            this.type = SPIDERTYPES[0];
            return;
        }
        const index = SPIDERTYPES.indexOf(this.type);
        this.type = SPIDERTYPES[index + 1];
        this.changeOrigin();
    }

    public changeOrigin() {
        switch (this.type) {
            case ('ixSpider'): {
                return this.spider = new IxSpider({
                    bookName: this.bookName,
                });
            }
            default: throw new Error(ERROR.NOTHISTYPE);
        }
    }
}
