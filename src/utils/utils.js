// export const arrToStr = (arr, prop)=>{
//     let str = '';
//     for(let i = 0; i < arr.length; i++){
//         str += arr[i][prop]+',';
//     }
  
//   return str.substr(0,str.length-1);
// }

export const arrToStr = (arr, prop)=>{
    return arr.reduce((a,b)=>a+','+b[prop], '').substr(1, arr.length*2-1);
  }