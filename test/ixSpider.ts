const chai = require('chai');
chai.use(require('chai-as-promised'));
import IxSpider from '../src/component/ixSpider';

const bookname = '大道朝天';
describe('ixSpider input bookname should renturn book number', function() {
    this.timeout(15000);
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

    it('ixSpider input bookname should return book 某一章节', function(done) {
        const spider = new IxSpider({
            bookName: bookname,
        });
        spider.getBookData('p2.html').then((data) => {
            chai.expect(data).to.be.match(/[/s]*.*[/s]*/);
            done();
        });
    });

    it('ixSpider input error book return error', function(done) {
        const bookName = 'dsadas';
        const spider = new IxSpider({
            bookName: bookName,
        });
        spider.searchBook().then((data) => {
            done();
        }).catch((e) => {
            chai.expect(e.message).to.be.equal('parse html error can not find book number');
            done();
        });
    });
});
