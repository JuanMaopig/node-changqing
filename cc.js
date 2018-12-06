function person(i) {
 return new Promise((resolve, reject) => {
     setTimeout(function () {
         // console.log(i);
         resolve(i);
     },3000)
 })
}
let B=person(11);
setTimeout(a,3010);
async function a(){
    console.time("b")
    console.log(await B)
    console.timeEnd("b")
    setTimeout(async function () {
        console.time("A1")
        console.log(await person(6));
        console.timeEnd("A1")
    },3000);
    setTimeout(async function () {
        console.time("A2")
        console.log(await person(8));
        console.timeEnd("A2")
    },3000)

}
