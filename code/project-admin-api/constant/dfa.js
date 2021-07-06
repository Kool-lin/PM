/*
 * @Author: your name
 * @Date: 2021-05-11 22:25:40
 * @LastEditTime: 2021-05-28 08:05:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-admin-api\constant\dfa.js
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