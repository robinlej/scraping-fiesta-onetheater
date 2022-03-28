const { balsamine } = require('./balsamine')
const { CentreCultureAuderghem } = require('./CentreCultureAuderghem')
const { lerideau } = require('./lerideau')
const { ToisonDor } = require('./ToisonDor')

// const { martyrs } = require('./martyrs')
// const { theatrenational } = require('./theatrenational')
// const { tanneurs } = require('./tanneurs')
// const { theatreduparc } = require('./theatreduparc')
// const { poche } = require('./poche')

const main = async () => {
    let plays = [
        // ...await martyrs(), 
        // ...await theatrenational(),
        // ...await poche(),
        // ...await theatreduparc(),
        // ...await tanneurs(),
        ...await balsamine(),
        ...await CentreCultureAuderghem(),
        ...await lerideau(),
        ...await ToisonDor(),
    ]

    console.log(plays)
}

main()
// .then(plays => plays.sort((a, b) => a.title > b.title))
// .then(plays => console.log(plays))