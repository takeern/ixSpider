import Spider from './component/index';

// module.exports = Spider;

const bookName = '大道朝天';

const spider = new Spider({
    bookName: bookName,
});

spider.run('searchBook').then((data) => {
    console.log(data);
});

spider.run('getBookList').then((data) => {
    console.log(data);
});

spider.run('getBookData', 'p2.html').then((data) => {
    console.log(data);
});

spider.run('getBookAllData').then((data) => {
    console.log(data);
});
