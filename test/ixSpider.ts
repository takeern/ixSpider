const chai = require('chai');
chai.use(require('chai-as-promised'));
import IxSpider from '../src/component/ixSpider';

const bookName = '大道朝天';
const spider = new IxSpider();
const bookNumber = '/d/169/169208/#epub_down';
describe('ixSpider input bookname should renturn book number', function() {
    this.timeout(15000);
    it('ixSpider input bookname should return book number', function(done) {
        spider.searchBook({
            bookName,
        }).then((data) => {
            console.log(data)
            chai.expect(data[0].bookNumber).to.be.equal('/d/169/169208/#txt_down');
            done();
        });
    });

    it('ixSpider input bookname should return book list', function(done) {
        spider.getBookList({
            bookNumber,
        }).then((data) => {
            chai.expect(data.bookList).to.an.instanceof(Array);
            done();
        });
    });

    it('ixSpider input bookname should return book 某一章节', function(done) {
        spider.getBookData({
            bookHref: 'p2.html',
            bookNumber,
        }).then((data) => {
            chai.expect(data.bookData).to.be.match(/[/s]*.*[/s]*/);
            done();
        });
    });

    it('ixSpider input error book return error', function(done) {
        const bookName = 'dsadas';
        spider.searchBook({
            bookName,
        }).then((data) => {
            done();
        }).catch((e) => {
            chai.expect(e.message).to.be.equal('parse html error can not find book number');
            done();
        });
    });
});
