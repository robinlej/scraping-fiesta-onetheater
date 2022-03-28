const { chapeau } = require('./chapeau')
const main = async () => {
    let plays = [
        ...await chapeau(), 
       
    ]

    console.log(plays)

  
}

main()
