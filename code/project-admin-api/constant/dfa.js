/*
 * @Author: coollin
 * @Date: 2021-04-06 19:31:12
 * @LastEditTime: 2021-08-24 10:21:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin-api\constant\dfa.js
 */

// 2s 之后返回双倍的值
function doubleAfter2seconds(num) {

    setTimeout(() => {
        console.log(num)
    }, 2000);

}
async function testResult() {
    await doubleAfter2seconds(30);
    await doubleAfter2seconds(50);
    await doubleAfter2seconds(3424);
    console.log(10);
}

testResult();
console.log('先执行');

console.log((Date.parse('2021-05-02') - Date.parse('2021-05-01')) / 86400000);