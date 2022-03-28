const { martyrs } = require('./martyrs')
const { theatrenational } = require('./theatrenational')
const { tanneurs } = require('./tanneurs')
const { theatreduparc } = require('./theatreduparc')
const { poche } = require('./poche')
const { theatredelavie } = require('./theatredelavie')
const { varia } = require('./varia')
const { trg } = require('./trg')
const { richesclaires } = require('./richesclaires')
const { ToisonDor } = require('./toisondor')
const { balsamine } = require('./balsamine')
const { lerideau } = require('./lerideau')
const { CentreCultureAuderghem } = require('./ccauderghem')
const { chapeau } = require ('./chapeau')

const main = async () => {
    let plays = [
        ...await martyrs(), 
        ...await theatrenational(),
        ...await poche(),
        ...await theatreduparc(),
        ...await tanneurs(),
        ...await theatredelavie(),
        ...await varia(),
        ...await trg(),
        ...await richesclaires(),
        ...await ToisonDor(),
        ...await balsamine(),
        ...await lerideau(),
        ...await CentreCultureAuderghem(),
        ...await chapeau()
    ]

    console.log(plays)

    // return plays

    // y = plays.sort((a, b) => a.title > b.title)
    // console.log(y)
}

main()

// const callMain = () => main()

// exports.callMain = callMain