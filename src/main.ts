import Spider from './component/index';
import IxSpider from '../src/component/ixSpider';

const spider = new IxSpider();

// export {
//     Spider
// };

// const bookName = 'dahsjkdas';
// spider.getBookData({
//     bookNumber: '/d/169/169208/',
//     bookHref: 'p3.html',
// }).then((data) => {
//     console.log(data);
// });
spider.getBookAllData({
    bookNumber: '/d/169/169208/',
}).then((data) => {
    console.log(data);
});
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
