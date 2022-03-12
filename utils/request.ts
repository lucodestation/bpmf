console.log('hehe')

const wait = (time) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}

const foo = async () =>{
  await wait(2000)
  const arr = [1, 2, 3]
  console.log(arr.includes(2))
  console.log(...arr)
}

foo()


