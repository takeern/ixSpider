import Spider from './component/index';
import IxSpider from '../src/component/ixSpider';

const spider = new IxSpider();

spider.searchBook({
    bookName: '大道朝天',
});
export {
    Spider
};

// const bookName = 'dahsjkdas';

// const spider = new Spider({
//     bookName: bookName,
// });

// spider.run('searchBook').then((data) => {
//     console.log(data, 'data');
// }).catch((e) => {
//     console.log(e, 'e');
// }) ;

// spider.run('getBookList').then((data) => {
//     console.log(data);
// });

// spider.run('getBookData', 'p2.html').then((data) => {
//     console.log(data);
// });

// spider.run('getBookAllData').then((data) => {
//     console.log(data);
// });
