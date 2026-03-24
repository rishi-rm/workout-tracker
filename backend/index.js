let s = "Hello3 work4 for2 world9"
let sum = 0;
// console.log(s.length)
for(let i = 0; i < s.length; i++){
    if(i == s.length-1){
       let n = Number(s.charAt(i))
    //    console.log(typeof n)
        sum+=n
    }
    else if(s.charAt(i)===' '){
        let n = Number(s.charAt(i-1))
        // console.log(typeof n)

        sum+=n
    }
}

console.log(sum)
