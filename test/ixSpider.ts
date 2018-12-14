const chai = require('chai');
chai.use(require('chai-as-promised'));
import IxSpider from '../src/component/ixSpider';

const bookname = '大道朝天';

describe('ixSpider input bookname should renturn book number', function() {
    it('ixSpider input bookname should return book number', function(done) {
        const spider = new IxSpider({
            bookName: bookname,
        });
        spider.searchBook().then((data) => {
            chai.expect(data).to.be.equal('/d/169/169208/#txt_down');
            done();
        });
    });

    it('ixSpider input bookname should return book list', function(done) {
        const spider = new IxSpider({
            bookName: bookname,
        });
        spider.getBookList().then((data) => {
            chai.expect(data).to.an.instanceof(Array);
            done();
        });
    });

    it('ixSpider input bookname should return book 某一章节', function() {
        const spider = new IxSpider({
            bookName: bookname,
        });
        return chai.expect(spider.getBookData('p2.html')).to.eventually.be.match(/[/s]*.*[/s]*/);
    });
});
