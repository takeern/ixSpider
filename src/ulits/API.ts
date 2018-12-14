/**
 * 爱下电子书 api
 */
enum ixdzs {
    /**
     * 获取书籍书号 https://www.ixdzs.com/bsearch?q=%E5%A4%A7%E9%81%93%E6%9C%9D%E5%A4%A9（大道朝天）
     */
    searchBookNumber = 'https://www.ixdzs.com/bsearch?q=',
    /**
     * 标识起点
     */
    indentif = '<span class="b_t"><a href="',
    /**
     * 小说地址
     */
    getList = 'https://read.ixdzs.com/',
    /**
     * 下载地址
     */
    download = 'https://www.ixdzs.com/',
}

export {
    ixdzs
};
