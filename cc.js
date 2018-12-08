function person(i) {
 return new Promise((resolve, reject) => {
     setTimeout(function () {
         // console.log(i);
         reject("this is reject i = "+i);
     },2)
 })
}
let B=person(11);
let D=person(50);
// setTimeout(a,3010);
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

async function ac() {
    try {
        // await Promise.all([B,D])
        let b=await B;
        console.log("555655");
        let c=await B;
        console.log("saa")
        // // console.log(await B);
        // // console.log(await D);
    }catch (e) {
        console.log(e);

    }
    try {
        let ac=await D;
    }catch (e) {
        console.log(e)
    }
    console.log("bb")

};
ac();


