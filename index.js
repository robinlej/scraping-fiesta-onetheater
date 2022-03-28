const { martyrs } = require('./martyrs')
const { theatrenational } = require('./theatrenational')
const { tanneurs } = require('./tanneurs')
const { theatreduparc } = require('./theatreduparc')
const { poche } = require('./poche')

const main = async () => {
    let plays = [
        ...await martyrs(), 
        ...await theatrenational(),
        ...await poche(),
        ...await theatreduparc(),
        ...await tanneurs()
    ]

    console.log(plays)
}

main()
// .then(plays => plays.sort((a, b) => a.title > b.title))
// .then(plays => console.log(plays))